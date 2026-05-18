"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, push, get } from "firebase/database";
import ProjectForm from "@/components/project/ProjectForm";
import ProjectList from "@/components/project/ProjectList";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        setLoading(false);
      } else {
        setUser(currentUser);
        try {
          await checkAdminStatus(currentUser.email);
          await fetchProjects();
        } catch (err) {
          console.error("Error in dashboard:", err);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const checkAdminStatus = async (email) => {
    try {
      const sanitizedEmail = email.replace(/\./g, "_");
      const adminRef = ref(db, `admin-emails/${sanitizedEmail}`);
      const snapshot = await get(adminRef);
      setIsAdmin(snapshot.exists() && snapshot.val() === true);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsRef = ref(db, "projects");
      const snapshot = await get(projectsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectsList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setProjects(projectsList);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    }
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      const projectsRef = ref(db, "projects");
      await push(projectsRef, {
        ...projectData,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });
      await fetchProjects();
      setShowProjectForm(false);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-zinc-900 border-b border-zinc-700 sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black">Projects</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-10">
        {!isAdmin ? (
          <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">Access Restricted</p>
            <p className="mt-2">You need admin access to manage content.</p>
            <p className="text-sm mt-2 text-yellow-300">Contact an administrator to request access.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black">Projects</h2>
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-zinc-200 transition"
              >
                {showProjectForm ? "Cancel" : "Add Project"}
              </button>
            </div>

            {showProjectForm && <ProjectForm onSubmit={handleProjectSubmit} />}

            <ProjectList projects={projects} onProjectUpdate={fetchProjects} />
          </>
        )}
      </div>
    </div>
  );
}

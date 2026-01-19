"use client";

import OrgSwitcher from "@/app/components/OrgSwitcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/app/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useFetch from "@/app/hooks/use-fetch";
import { createProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

const CreateProjectPage = () => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    data: project,
    loading,
    fn: createProjectFn,
  } = useFetch(createProject);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully");
      router.push(`/project/${project.id}`);
    }
  }, [project, router]);

  const onSubmit = async (data) => {
    await createProjectFn(data);
  };

  if (!isOrgLoaded || !isUserLoaded) return null;


  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur">
          <CardContent className="py-10 text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert size={26} />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Admin Access Required
            </h2>
            <p className="text-sm text-gray-400">
              Only organization admins can create new projects.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-30 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-white/5 border border-white/10 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Create New Project
            </CardTitle>
            <CardDescription className="text-gray-400">
              Set up a new workspace to plan, track, and deliver work efficiently.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Project Name */}
              <div>
                <Input
                  placeholder="Project name"
                  className="bg-slate-950"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Project Key */}
              <div>
                <Input
                  placeholder="Project key (e.g. SPT)"
                  className="bg-slate-950 uppercase"
                  {...register("key")}
                />
                {errors.key && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.key.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Textarea
                  placeholder="Brief description of your project"
                  className="bg-slate-950 min-h-[110px]"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              >
                {loading ? "Creating project..." : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateProjectPage;

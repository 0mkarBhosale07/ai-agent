import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Image, ListTodo, QrCode, Thermometer } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

const Tools = () => {
  return (
    <section className="py-12 w-full md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col justify-center items-center mb-10 space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black dark:text-white">
              Powerful AI Tools
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Access these powerful tools
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mx-auto  md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="overflow-hidden relative transition-all border-primary/20 hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r opacity-50 from-blue-500/10 to-blue-500/5"></div>
              <CardHeader>
                <div className="inline-flex justify-center items-center p-2 mb-2 w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/30">
                  <Thermometer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Weather Data</CardTitle>
                <CardDescription>
                  Get real-time weather information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access accurate forecasts, temperature readings, with weather
                  API integration.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="overflow-hidden relative transition-all border-primary/20 hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r opacity-50 from-green-500/10 to-green-500/5"></div>
              <CardHeader>
                <div className="inline-flex justify-center items-center p-2 mb-2 w-12 h-12 bg-green-100 rounded-full dark:bg-green-900/30">
                  <ListTodo className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Todo Tasks</CardTitle>
                <CardDescription>
                  Manage tasks with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create, and organize your tasks with intelligent suggestions
                  and reminders to boost your productivity.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="overflow-hidden relative transition-all border-primary/20 hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r opacity-50 from-purple-500/10 to-purple-500/5"></div>
              <CardHeader>
                <div className="inline-flex justify-center items-center p-2 mb-2 w-12 h-12 bg-purple-100 rounded-full dark:bg-purple-900/30">
                  <Image className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Image Generation</CardTitle>
                <CardDescription>Create AI-powered images</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate high-quality images from text descriptions using
                  cutting-edge AI models for your creative projects.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="overflow-hidden relative transition-all border-primary/20 hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r opacity-50 from-amber-500/10 to-amber-500/5"></div>
              <CardHeader>
                <div className="inline-flex justify-center items-center p-2 mb-2 w-12 h-12 bg-amber-100 rounded-full dark:bg-amber-900/30">
                  <QrCode className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>UPI QR Code</CardTitle>
                <CardDescription>Generate payment QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create custom UPI QR codes for seamless payment collection,
                  perfect for businesses and personal use.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tools;

import React, { useEffect, useRef, useState } from "react";
import Modal from "../components/modals/Modal";
import ImageGallery from "../components/ImageGallery";
import TaskMarker from "../components/TaskMarker";
import TaskListItem from "../components/TaskListItem";
import { useModalStore } from "../store/useModalStore";
import {
  getTasksByImage,
  addTaskToUser,
  deleteTask,
  updateTask,
} from "../services/taskService";
import { addImage, deleteImage } from "../services/imageService";
import type { TaskDocType, ImageDocType } from "../db/rxdb";
import { ASSETS } from "../constants/assets";
import { refreshTasksAndMarkers, type MarkerData } from "../utils/taskUtils";
import { fetchUserImages, readFileAsDataURL } from "../utils/imageUtils";
import { getCurrentUserId, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const PlanPage: React.FC = () => {
  const { isOpen, open, close } = useModalStore();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDocType[]>([]);
  const [images, setImages] = useState<ImageDocType[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentImageData, setCurrentImageData] = useState<string>(
    ASSETS.images.defaultPlan
  );
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [editingTask, setEditingTask] = useState<TaskDocType | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [pendingMarker, setPendingMarker] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      const userId = getCurrentUserId();
      if (!userId) return;

      try {
        const imagesData = await fetchUserImages(userId);

        if (!isMounted) return;

        if (imagesData.length === 0) {
          const response = await fetch(ASSETS.images.defaultPlan);
          const blob = await response.blob();
          const base64data = await readFileAsDataURL(blob as File);

          const defaultImage = await addImage(
            userId,
            "Default Construction Plan",
            base64data
          );

          if (isMounted) {
            setImages([defaultImage]);
            setSelectedImageId(defaultImage.id);
            setCurrentImageData(base64data);
          }
        } else {
          setImages(imagesData);

          if (!selectedImageId && imagesData.length > 0) {
            setSelectedImageId(imagesData[0].id);
            setCurrentImageData(imagesData[0].imageData);
          }
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedImageId) {
        setTasks([]);
        setMarkers([]);
        return;
      }

      try {
        const { tasks, markers } = await refreshTasksAndMarkers(
          selectedImageId
        );
        setTasks(tasks);
        setMarkers(markers);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    fetchTasks();
  }, [selectedImageId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      const imageData = await readFileAsDataURL(file);
      const newImage = await addImage(userId, file.name, imageData);

      const imagesData = await fetchUserImages(userId);
      setImages(imagesData);

      setSelectedImageId(newImage.id);
      setCurrentImageData(imageData);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const handleSelectImage = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (image) {
      setSelectedImageId(imageId);
      setCurrentImageData(image.imageData);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);

      const userId = getCurrentUserId();
      if (!userId) return;

      const imagesData = await fetchUserImages(userId);
      setImages(imagesData);

      if (selectedImageId === imageId) {
        if (imagesData.length > 0) {
          setSelectedImageId(imagesData[0].id);
          setCurrentImageData(imagesData[0].imageData);
        } else {
          setSelectedImageId(null);
          setCurrentImageData(ASSETS.images.defaultPlan);
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!imgRef.current || !selectedImageId) return;

    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    try {
      await updateTask(taskId, { x, y });

      const { tasks, markers } = await refreshTasksAndMarkers(selectedImageId);
      setTasks(tasks);
      setMarkers(markers);
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rec = imgRef.current?.getBoundingClientRect();
    if (!rec) return;

    const x = ((e.clientX - rec.left) / rec.width) * 100;
    const y = ((e.clientY - rec.top) / rec.height) * 100;

    setPendingMarker({ x, y });
    setEditingTask(null);
    open();
  };

  const handleMarkerDoubleClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setPendingMarker(null);
      open();
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-200 via-emerald-300 to-green-400 min-h-screen w-full flex flex-col items-center py-10 justify-center">
      <div className="bg-white/90 backdrop-blur-sm w-[80%] text-center py-6 rounded-t-3xl shadow-lg border-b border-emerald-200 relative">
        <h1 className="text-3xl font-bold text-emerald-800 tracking-wide">
          Plan Overview
        </h1>
        <p className="text-emerald-700 mt-1 text-sm">
          Manage and visualize your building layout with ease
        </p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-row w-[80%] h-[75vh] rounded-b-3xl overflow-hidden shadow-2xl border border-emerald-300">
        <div className="bg-emerald-900/30 w-[70%] p-6 flex flex-col backdrop-blur-sm">
          <p className="text-center text-white font-semibold mb-4 text-lg">
            Building Plan
          </p>
          <div className="w-full flex-1 rounded-xl p-4 bg-white/80 shadow-inner relative overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <img
                  ref={imgRef}
                  src={currentImageData}
                  alt="Building Plan"
                  onClick={handleImageClick}
                  className="max-w-full max-h-full object-contain rounded-xl cursor-crosshair block"
                  style={{ maxHeight: "calc(75vh - 200px)" }}
                />

                {markers.map((marker) => (
                  <TaskMarker
                    key={marker.taskId}
                    taskId={marker.taskId}
                    x={marker.x}
                    y={marker.y}
                    color={marker.color}
                    taskName={marker.taskName}
                    onDoubleClick={handleMarkerDoubleClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 w-[30%] p-6 flex flex-col backdrop-blur-sm border-l border-emerald-200">
          <p className="text-center text-emerald-800 font-semibold mb-4 text-lg">
            Task List
          </p>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {tasks.map((task, i) => (
              <TaskListItem
                key={i}
                task={task}
                onEdit={() => {
                  setEditingTask(task);
                  open();
                }}
                onDelete={async () => {
                  if (window.confirm("Delete this task?")) {
                    await deleteTask(task.id);
                    if (selectedImageId) {
                      const { tasks, markers } = await refreshTasksAndMarkers(
                        selectedImageId
                      );
                      setTasks(tasks);
                      setMarkers(markers);
                    }
                  }
                }}
              />
            ))}
          </div>

          <label className="border-2 border-emerald-400 bg-white/80 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:bg-emerald-50 transition">
            Upload your photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-4">
              <ImageGallery
                images={images}
                selectedImageId={selectedImageId || undefined}
                onSelectImage={handleSelectImage}
                onDeleteImage={handleDeleteImage}
              />
            </div>
          )}

          <button
            className="mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-semibold transition-all"
            onClick={() => {
              alert(
                "Please click on the image to select a location for the task marker"
              );
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => close()}
        >
          <div
            className="bg-white w-[400px] shadow-lg py-5 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Modal
              editingTask={editingTask}
              onTaskUpdated={async (
                taskId: string,
                updates: Partial<TaskDocType>
              ) => {
                try {
                  await updateTask(taskId, updates);

                  if (selectedImageId) {
                    const tasksFromDB = await getTasksByImage(selectedImageId);
                    const tasksData = tasksFromDB.map(
                      (t) => t.toJSON() as TaskDocType
                    );
                    setTasks(tasksData);

                    const markersFromTasks = tasksData
                      .filter((t) => t.x !== undefined && t.y !== undefined)
                      .map((t) => ({
                        x: t.x!,
                        y: t.y!,
                        color: t.color || "#34D399",
                        taskId: t.id,
                        taskName: t.title || t.name,
                      }));
                    setMarkers(markersFromTasks);
                  }

                  setEditingTask(null);
                  setPendingMarker(null);
                  close();
                } catch (error) {
                  console.error("Error updating task:", error);
                  alert("Failed to update task");
                }
              }}
              onTaskCreated={async (
                taskName?: string,
                color?: string,
                subtasks?: import("../db/rxdb").SubtaskType[]
              ) => {
                try {
                  const userId = localStorage.getItem("currentUserId");
                  if (!userId) {
                    return;
                  }

                  if (!pendingMarker) {
                    alert(
                      "Please click on the image to select a location for the task marker"
                    );
                    close();
                    return;
                  }

                  if (!selectedImageId) {
                    alert("Please upload an image first");
                    close();
                    return;
                  }

                  const newTask = await addTaskToUser(
                    userId,
                    taskName || "New Task",
                    {
                      title: taskName || "New Task",
                      color: color || "#34D399",
                      x: pendingMarker.x,
                      y: pendingMarker.y,
                      subtasks: subtasks || [],
                      imageId: selectedImageId,
                    }
                  );

                  setMarkers((prev) => [
                    ...prev,
                    {
                      ...pendingMarker,
                      color: color || "#34D399",
                      taskId: newTask.id,
                      taskName: taskName || "New Task",
                    },
                  ]);
                  setPendingMarker(null);

                  const tasksFromDB = await getTasksByImage(selectedImageId);
                  const tasksData = tasksFromDB.map(
                    (t) => t.toJSON() as TaskDocType
                  );
                  setTasks(tasksData);

                  close();
                } catch (error) {
                  console.error("Error creating task:", error);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPage;

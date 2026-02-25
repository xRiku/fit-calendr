"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PRESET_COLORS } from "@/lib/constants/colors";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useState } from "react";

export interface BasePreset {
    id: string;
    label: string;
    color: string;
    order: number;
}

interface PresetItemProps {
    preset: BasePreset;
    isFirst: boolean;
    isLast: boolean;
    onColorChange: (preset: BasePreset, newColor: string) => Promise<void>;
    onLabelSave: (preset: BasePreset, newLabel: string) => Promise<void>;
    onReorder: (preset: BasePreset, direction: "up" | "down") => Promise<void>;
    onDelete: (presetId: string) => Promise<void>;
}

export function PresetItem({
    preset,
    isFirst,
    isLast,
    onColorChange,
    onLabelSave,
    onReorder,
    onDelete,
}: PresetItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(preset.label);

    const handleSave = async () => {
        if (editLabel.trim() !== preset.label) {
            await onLabelSave(preset, editLabel.trim());
        }
        setIsEditing(false);
    };

    return (
        <div>
            {/* Mobile: Flat with separators | Desktop: Card style */}
            <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="h-6 w-6 rounded-full border-2 border-neutral-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
                            style={{ backgroundColor: preset.color }}
                            aria-label={`Change color for ${preset.label}`}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                        <div className="grid grid-cols-4 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => onColorChange(preset, color.value)}
                                    title={color.name}
                                    aria-label={`Select ${color.name} color`}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {isEditing ? (
                    <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onBlur={handleSave}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSave();
                            }
                            if (e.key === "Escape") {
                                setIsEditing(false);
                                setEditLabel(preset.label);
                            }
                        }}
                        className="flex-1 bg-neutral-800 border-neutral-700"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(true);
                            setEditLabel(preset.label);
                        }}
                        className="flex-1 text-left text-sm font-medium text-neutral-200 hover:text-neutral-100 transition-colors focus:outline-none"
                    >
                        {preset.label}
                    </button>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-400 hover:text-white hover:bg-white/10"
                        onClick={() => onReorder(preset, "up")}
                        disabled={isFirst}
                        aria-label="Move up"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-400 hover:text-white hover:bg-white/10"
                        onClick={() => onReorder(preset, "down")}
                        disabled={isLast}
                        aria-label="Move down"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-neutral-500 hover:text-red-400"
                            aria-label="Delete preset"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark:border-neutral-800 dark:bg-neutral-900">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-neutral-400">
                                Are you sure you want to delete &quot;{preset.label}&quot;? This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(preset.id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            {/* Horizontal separator between items on mobile, hidden on last item */}
            {!isLast && <Separator className="md:hidden" />}
        </div>
    );
}

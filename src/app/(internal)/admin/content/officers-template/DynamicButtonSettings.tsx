"use client";

import { useState } from "react";
import { AdminFieldLabel } from "../../components/admin-ui";

type ButtonPart = {
  id: string;
  label: string;
  link: string;
};

type Props = {
  initialParts: ButtonPart[];
};

export default function DynamicButtonSettings({ initialParts }: Props) {
  const [parts, setParts] = useState<ButtonPart[]>(initialParts);

  const adminInputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 transition-colors focus:border-[#F26223] focus:outline-none focus:ring-1 focus:ring-[#F26223]";
  
  const adminBtnSecondaryClass =
    "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#F26223]/50";
  
  const adminBtnDangerClass =
    "inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50";

  const handleAddPart = () => {
    setParts([
      ...parts,
      {
        id: `part-${Date.now()}`,
        label: "New Button",
        link: "/officers#part-new",
      },
    ]);
  };

  const handleRemovePart = (idToRemove: string) => {
    setParts(parts.filter((p) => p.id !== idToRemove));
  };

  const handleChange = (id: string, field: "label" | "link", value: string) => {
    setParts(
      parts.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="partsJson" value={JSON.stringify(parts)} />

      {parts.map((part, index) => (
        <div key={part.id} className="pt-6 border-t border-white/10 first:pt-4 first:border-0 relative group">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-zinc-200">Button {index + 1} Settings</h4>
            <button
              type="button"
              onClick={() => handleRemovePart(part.id)}
              className={adminBtnDangerClass}
            >
              Remove
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <AdminFieldLabel>Label</AdminFieldLabel>
              <input
                value={part.label}
                onChange={(e) => handleChange(part.id, "label", e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div>
              <AdminFieldLabel>Link / Anchor</AdminFieldLabel>
              <input
                value={part.link}
                onChange={(e) => handleChange(part.id, "link", e.target.value)}
                className={adminInputClass}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-white/10 flex justify-center">
        <button
          type="button"
          onClick={handleAddPart}
          className={adminBtnSecondaryClass}
        >
          + Add another button
        </button>
      </div>
    </div>
  );
}

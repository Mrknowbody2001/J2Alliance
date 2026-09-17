"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubCategoryDTO } from "@/types";

type SubCategoryTableProps = {
  subcategories: SubCategoryDTO[];
};

export default function SubCategoryTable({ subcategories }: SubCategoryTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sub category? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    const response = await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      alert("Failed to delete sub category. Please try again.");
      return;
    }

    router.refresh();
  };

  if (subcategories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-sm text-zinc-500">
        No sub categories yet. Create your first sub category to get started.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Main Category</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell className="max-w-[180px] truncate text-xs text-zinc-500">
                {subcategory.id}
              </TableCell>
              <TableCell className="font-medium text-zinc-900">
                {subcategory.name}
              </TableCell>
              <TableCell>
                {subcategory.imageUrl ? <img src={subcategory.imageUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="text-xs text-zinc-400">None</span>}
              </TableCell>
              <TableCell>{subcategory.categoryName}</TableCell>
              <TableCell>
                {new Date(subcategory.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/subcategories/${subcategory.id}`}>View</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/subcategories/edit/${subcategory.id}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === subcategory.id}
                    onClick={() => handleDelete(subcategory.id)}
                  >
                    {deletingId === subcategory.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

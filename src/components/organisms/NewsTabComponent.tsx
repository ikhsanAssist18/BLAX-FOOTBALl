import { Plus } from "lucide-react";
import Button from "../atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/Dialog";
import { useState } from "react";
import Input from "../atoms/Input";
import { Card, CardContent } from "../atoms/Card";

export default function NewsTab() {
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Management Berita</h2>
        <Button
          variant="black"
          size="sm"
          onClick={() => setShowNewsDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Berita
        </Button>

        <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Berita Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium">
                  Judul Berita
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Masukkan judul berita"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block mb-1 font-medium">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  placeholder="Ringkasan singkat berita"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="content" className="block mb-1 font-medium">
                  Konten
                </label>
                <textarea
                  id="content"
                  rows={6}
                  placeholder="Isi lengkap berita"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  URL Gambar
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  type="text"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setShowNewsDialog(false)}
                >
                  Batal
                </Button>
                <Button size="sm" variant="black">
                  Publish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <img
              src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
              alt="News"
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold mb-2">Turnamen Mini Soccer Bulanan</h3>
            <p className="text-sm text-gray-600 mb-3">
              Pendaftaran turnamen dimulai! Hadiah total 5 juta rupiah untuk
              juara.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">2025-01-10</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

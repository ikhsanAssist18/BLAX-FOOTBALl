import { Clock, Plus, Edit, Trash2 } from "lucide-react";
import Button from "../atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/Dialog";
import { useEffect, useState } from "react";
import Input from "../atoms/Input";
import { Card, CardContent } from "../atoms/Card";
import { useNotifications } from "./NotificationContainer";
import { News } from "@/types/news";
import { newsService } from "@/utils/news";
import { adminService } from "@/utils/admin";
import ConfirmationModal from "../molecules/ConfirmationModal";
import { formatDate } from "@/lib/helper";

export default function NewsTab() {
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const { showSuccess, showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const result = await newsService.getNews();
      if (result) {
        setNews(result);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      showError("Gagal memuat berita", "Silakan refresh halaman");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setImageUrl("");
    setCategory("");
    setEditingNews(null);
  };

  const openAddNewsDialog = () => {
    resetForm();
    setShowNewsDialog(true);
  };

  const openEditNewsDialog = (newsItem: News) => {
    setEditingNews(newsItem);
    setTitle(newsItem.title);
    setExcerpt(newsItem.excerpt);
    setContent(newsItem.content);
    setImageUrl(newsItem.imageUrl);
    setCategory(newsItem.category);
    setShowNewsDialog(true);
  };

  const closeNewsDialog = () => {
    setShowNewsDialog(false);
    resetForm();
  };

  const validateForm = () => {
    if (!title.trim()) {
      showError("Validasi gagal", "Judul berita harus diisi");
      return false;
    }
    if (!excerpt.trim()) {
      showError("Validasi gagal", "Excerpt harus diisi");
      return false;
    }
    if (!content.trim()) {
      showError("Validasi gagal", "Konten harus diisi");
      return false;
    }
    if (!imageUrl.trim()) {
      showError("Validasi gagal", "URL gambar harus diisi");
      return false;
    }
    if (!category.trim()) {
      showError("Validasi gagal", "Kategori harus diisi");
      return false;
    }
    return true;
  };

  const handleSubmitNews = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingNews) {
        // Update existing news
        const updatedNews: News = {
          ...editingNews,
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim(),
          category: category.trim(),
        };

        // await adminService.updateNews(editingNews.id, updatedNews);
        showSuccess("Berhasil", "Berita berhasil diperbarui");
      } else {
        // Create new news
        const newNews: Omit<News, "id" | "publishAt" | "readTime"> = {
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim(),
          category: category.trim(),
        };

        await adminService.createNews(newNews);
        showSuccess("Berhasil", "Berita berhasil ditambahkan");
      }

      closeNewsDialog();
      fetchNews(); // Refresh news list
    } catch (error) {
      console.error("Error submitting news:", error);
      showError(
        editingNews ? "Gagal memperbarui berita" : "Gagal menambahkan berita",
        "Silakan coba lagi"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNews = async () => {
    if (!newsToDelete) return;

    try {
      // await adminService.deleteNews(newsToDelete);
      showSuccess("Berhasil", "Berita berhasil dihapus");
      setNewsToDelete(null);
      fetchNews(); // Refresh news list
    } catch (error) {
      console.error("Error deleting news:", error);
      showError("Gagal menghapus berita", "Silakan coba lagi");
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowConfirmation(true);
    setNewsToDelete(id);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Management Berita</h2>
          <Button
            variant="black"
            size="sm"
            onClick={openAddNewsDialog}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Berita
          </Button>
        </div>

        {/* News Dialog */}
        <Dialog open={showNewsDialog} onOpenChange={closeNewsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium">
                  Judul Berita *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Masukkan judul berita"
                />
              </div>

              <div>
                <label htmlFor="category" className="block mb-1 font-medium">
                  Kategori *
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  type="text"
                  placeholder="Kategori berita (contoh: Olahraga, Turnamen, Berita)"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block mb-1 font-medium">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan singkat berita"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="content" className="block mb-1 font-medium">
                  Konten *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Isi lengkap berita"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  URL Gambar *
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={closeNewsDialog}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  variant="black"
                  onClick={handleSubmitNews}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingNews
                    ? "Update"
                    : "Publish"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* News Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading berita...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-xl mb-2">📰</div>
                <div>Belum ada berita. Tambahkan berita pertama Anda!</div>
              </div>
            ) : (
              news.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-sky-100 overflow-hidden"
                >
                  {/* Full width image */}
                  <div className="relative overflow-hidden h-48 w-full">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg";
                      }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>

                    {/* Read Time Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-gray-500">
                        📅 {formatDate(item.publishAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditNewsDialog(item)}
                          disabled={isLoading}
                          className="flex items-center"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteClick(item.id)}
                          disabled={isLoading}
                          className="flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDeleteNews}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}

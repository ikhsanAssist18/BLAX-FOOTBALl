"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  CSS,
} from "@dnd-kit/sortable";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Users,
  Trophy,
  Star,
  Clock,
  MapPin,
  Calendar,
  Save,
  RefreshCw,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import Button from "../atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/Dialog";
import Input from "../atoms/Input";
import Badge from "../atoms/Badge";
import ConfirmationModal from "../molecules/ConfirmationModal";
import { useNotifications } from "./NotificationContainer";
import { formatDate } from "@/lib/helper";

// Types
interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
  isConfirmed: boolean;
  notes?: string;
}

interface LineupMatch {
  id: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED";
  totalPlayers: number;
  teamAPlayers: LineupPlayer[];
  teamBPlayers: LineupPlayer[];
  createdAt: string;
  updatedAt: string;
}

// Sortable Item Component
interface SortableItemProps {
  player: LineupPlayer;
  onEdit: (player: LineupPlayer) => void;
  onDelete: (playerId: string) => void;
  disabled?: boolean;
}

function SortableItem({ player, onEdit, onDelete, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50" : ""}
        ${disabled ? "opacity-50" : ""}
      `}
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
              player.position === "GK" 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
                : "bg-gradient-to-r from-blue-400 to-blue-500"
            }`}>
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 truncate">{player.name}</p>
                <Badge
                  className={`text-xs ${
                    player.position === "GK"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  {player.position}
                </Badge>
                {player.isConfirmed && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    Confirmed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{player.phone}</p>
              {player.notes && (
                <p className="text-xs text-gray-500 italic mt-1">{player.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Number */}
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
            {player.order}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(player)}
            disabled={disabled}
            className="hover:bg-yellow-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(player.id)}
            disabled={disabled}
            className="hover:bg-red-50 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Drag Overlay Component
function DragOverlayItem({ player }: { player: LineupPlayer | null }) {
  if (!player) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg ring-2 ring-blue-500 ring-opacity-50">
      <div className="flex items-center space-x-4">
        <GripVertical className="w-5 h-5 text-gray-400" />
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            player.position === "GK" 
              ? "bg-gradient-to-r from-yellow-400 to-orange-500" 
              : "bg-gradient-to-r from-blue-400 to-blue-500"
          }`}>
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900">{player.name}</p>
              <Badge
                className={`text-xs ${
                  player.position === "GK"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}
              >
                {player.position}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{player.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LineupManagement() {
  const [lineups, setLineups] = useState<LineupMatch[]>([]);
  const [selectedLineup, setSelectedLineup] = useState<LineupMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<LineupPlayer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<LineupPlayer | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form state
  const [playerForm, setPlayerForm] = useState({
    name: "",
    phone: "",
    position: "PLAYER" as "GK" | "PLAYER",
    team: "A" as "A" | "B",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { showSuccess, showError } = useNotifications();

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLineups();
  }, []);

  const fetchLineups = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockLineups: LineupMatch[] = [
        {
          id: "1",
          scheduleName: "Fun Game Weekday - January 20",
          venue: "Lapangan Futsal Central",
          date: "2025-01-20",
          time: "19:00",
          status: "DRAFT",
          totalPlayers: 16,
          teamAPlayers: [
            {
              id: "p1",
              name: "John Doe",
              phone: "08123456789",
              position: "GK",
              team: "A",
              order: 1,
              isConfirmed: true,
            },
            {
              id: "p2",
              name: "Jane Smith",
              phone: "08987654321",
              position: "PLAYER",
              team: "A",
              order: 2,
              isConfirmed: true,
            },
            {
              id: "p3",
              name: "Mike Johnson",
              phone: "08555666777",
              position: "PLAYER",
              team: "A",
              order: 3,
              isConfirmed: false,
            },
          ],
          teamBPlayers: [
            {
              id: "p4",
              name: "Sarah Wilson",
              phone: "08111222333",
              position: "GK",
              team: "B",
              order: 1,
              isConfirmed: true,
            },
            {
              id: "p5",
              name: "David Brown",
              phone: "08444555666",
              position: "PLAYER",
              team: "B",
              order: 2,
              isConfirmed: true,
            },
          ],
          createdAt: "2025-01-15T10:00:00Z",
          updatedAt: "2025-01-15T10:00:00Z",
        },
      ];

      setLineups(mockLineups);
      if (mockLineups.length > 0) {
        setSelectedLineup(mockLineups[0]);
      }
    } catch (error) {
      console.error("Error fetching lineups:", error);
      showError("Error", "Failed to load lineups");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the dragged player
    const allPlayers = [
      ...(selectedLineup?.teamAPlayers || []),
      ...(selectedLineup?.teamBPlayers || []),
    ];
    const player = allPlayers.find(p => p.id === active.id);
    setDraggedPlayer(player || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedPlayer(null);

    if (!over || !selectedLineup) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Find which team the active and over items belong to
    const activePlayer = [
      ...selectedLineup.teamAPlayers,
      ...selectedLineup.teamBPlayers,
    ].find(p => p.id === activeId);

    if (!activePlayer) return;

    const team = activePlayer.team;
    const teamPlayers = team === "A" ? selectedLineup.teamAPlayers : selectedLineup.teamBPlayers;
    
    const oldIndex = teamPlayers.findIndex(p => p.id === activeId);
    const newIndex = teamPlayers.findIndex(p => p.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newPlayers = arrayMove(teamPlayers, oldIndex, newIndex);
    
    // Update order numbers
    const updatedPlayers = newPlayers.map((player, index) => ({
      ...player,
      order: index + 1,
    }));

    // Update the lineup
    const updatedLineup = {
      ...selectedLineup,
      [team === "A" ? "teamAPlayers" : "teamBPlayers"]: updatedPlayers,
    };

    setSelectedLineup(updatedLineup);
    setHasUnsavedChanges(true);
    
    // Update in lineups array
    setLineups(prev => prev.map(lineup => 
      lineup.id === selectedLineup.id ? updatedLineup : lineup
    ));
  };

  const validatePlayerForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!playerForm.name.trim()) {
      errors.name = "Player name is required";
    }

    if (!playerForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(playerForm.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10-15 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setPlayerForm({
      name: "",
      phone: "",
      position: "PLAYER",
      team: "A",
      notes: "",
    });
    setShowPlayerDialog(true);
  };

  const handleEditPlayer = (player: LineupPlayer) => {
    setEditingPlayer(player);
    setPlayerForm({
      name: player.name,
      phone: player.phone,
      position: player.position,
      team: player.team,
      notes: player.notes || "",
    });
    setShowPlayerDialog(true);
  };

  const handleSavePlayer = async () => {
    if (!validatePlayerForm() || !selectedLineup) return;

    try {
      if (editingPlayer) {
        // Update existing player
        const updatedLineup = { ...selectedLineup };
        const teamKey = editingPlayer.team === "A" ? "teamAPlayers" : "teamBPlayers";
        
        updatedLineup[teamKey] = updatedLineup[teamKey].map(player =>
          player.id === editingPlayer.id
            ? {
                ...player,
                name: playerForm.name.trim(),
                phone: playerForm.phone.trim(),
                position: playerForm.position,
                team: playerForm.team,
                notes: playerForm.notes.trim(),
              }
            : player
        );

        setSelectedLineup(updatedLineup);
        setLineups(prev => prev.map(lineup => 
          lineup.id === selectedLineup.id ? updatedLineup : lineup
        ));
        
        showSuccess("Player updated successfully");
      } else {
        // Add new player
        const newPlayer: LineupPlayer = {
          id: `player_${Date.now()}`,
          name: playerForm.name.trim(),
          phone: playerForm.phone.trim(),
          position: playerForm.position,
          team: playerForm.team,
          order: 0, // Will be set based on team
          isConfirmed: false,
          notes: playerForm.notes.trim(),
        };

        const updatedLineup = { ...selectedLineup };
        const teamKey = playerForm.team === "A" ? "teamAPlayers" : "teamBPlayers";
        
        // Set order based on current team size
        newPlayer.order = updatedLineup[teamKey].length + 1;
        updatedLineup[teamKey] = [...updatedLineup[teamKey], newPlayer];
        updatedLineup.totalPlayers = updatedLineup.teamAPlayers.length + updatedLineup.teamBPlayers.length;

        setSelectedLineup(updatedLineup);
        setLineups(prev => prev.map(lineup => 
          lineup.id === selectedLineup.id ? updatedLineup : lineup
        ));
        
        showSuccess("Player added successfully");
      }

      setHasUnsavedChanges(true);
      setShowPlayerDialog(false);
      resetPlayerForm();
    } catch (error) {
      showError("Error", "Failed to save player");
    }
  };

  const handleDeletePlayer = async () => {
    if (!playerToDelete || !selectedLineup) return;

    try {
      const updatedLineup = { ...selectedLineup };
      
      // Remove from team A
      updatedLineup.teamAPlayers = updatedLineup.teamAPlayers.filter(
        p => p.id !== playerToDelete
      );
      
      // Remove from team B
      updatedLineup.teamBPlayers = updatedLineup.teamBPlayers.filter(
        p => p.id !== playerToDelete
      );

      // Reorder remaining players
      updatedLineup.teamAPlayers = updatedLineup.teamAPlayers.map((player, index) => ({
        ...player,
        order: index + 1,
      }));
      
      updatedLineup.teamBPlayers = updatedLineup.teamBPlayers.map((player, index) => ({
        ...player,
        order: index + 1,
      }));

      updatedLineup.totalPlayers = updatedLineup.teamAPlayers.length + updatedLineup.teamBPlayers.length;

      setSelectedLineup(updatedLineup);
      setLineups(prev => prev.map(lineup => 
        lineup.id === selectedLineup.id ? updatedLineup : lineup
      ));
      
      setHasUnsavedChanges(true);
      setShowDeleteConfirm(false);
      setPlayerToDelete(null);
      showSuccess("Player removed successfully");
    } catch (error) {
      showError("Error", "Failed to remove player");
    }
  };

  const handleSaveLineup = async () => {
    if (!selectedLineup) return;

    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, save to backend
      console.log("Saving lineup:", selectedLineup);
      
      setHasUnsavedChanges(false);
      showSuccess("Lineup saved successfully");
    } catch (error) {
      showError("Error", "Failed to save lineup");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmLineup = async () => {
    if (!selectedLineup) return;

    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedLineup = {
        ...selectedLineup,
        status: "CONFIRMED" as const,
        teamAPlayers: selectedLineup.teamAPlayers.map(p => ({ ...p, isConfirmed: true })),
        teamBPlayers: selectedLineup.teamBPlayers.map(p => ({ ...p, isConfirmed: true })),
      };

      setSelectedLineup(updatedLineup);
      setLineups(prev => prev.map(lineup => 
        lineup.id === selectedLineup.id ? updatedLineup : lineup
      ));
      
      setHasUnsavedChanges(false);
      showSuccess("Lineup confirmed successfully");
    } catch (error) {
      showError("Error", "Failed to confirm lineup");
    } finally {
      setSaving(false);
    }
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      name: "",
      phone: "",
      position: "PLAYER",
      team: "A",
      notes: "",
    });
    setFormErrors({});
    setEditingPlayer(null);
  };

  const handlePlayerInputChange = (field: string, value: string) => {
    setPlayerForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter lineups
  const filteredLineups = lineups.filter(lineup => {
    const matchesSearch = !searchTerm || 
      lineup.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lineup.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lineup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lineup Management</h2>
            <p className="text-gray-600 mt-1">
              Organize and manage player lineups for matches
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                Unsaved changes
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveLineup}
              disabled={!hasUnsavedChanges || saving}
              className="flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            {selectedLineup && selectedLineup.status === "DRAFT" && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmLineup}
                disabled={saving}
                className="flex items-center"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Confirm Lineup
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lineup List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Match Lineups
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search matches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                {/* Lineup List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredLineups.map((lineup) => (
                    <button
                      key={lineup.id}
                      onClick={() => setSelectedLineup(lineup)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedLineup?.id === lineup.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {lineup.scheduleName}
                          </h4>
                          <Badge className={`text-xs ${getStatusColor(lineup.status)}`}>
                            {lineup.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {lineup.venue}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(lineup.date)} • {lineup.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {lineup.totalPlayers} players
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredLineups.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No lineups found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Lineup Editor */}
          <div className="lg:col-span-3">
            {selectedLineup ? (
              <div className="space-y-6">
                {/* Match Info Header */}
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedLineup.scheduleName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedLineup.venue}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(selectedLineup.date)} • {selectedLineup.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {selectedLineup.totalPlayers} players
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(selectedLineup.status)}>
                          {selectedLineup.status}
                        </Badge>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddPlayer}
                          disabled={selectedLineup.status === "COMPLETED"}
                          className="flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Player
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Teams */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team A */}
                  <Card className="border-red-200 bg-red-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-red-900">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                          Team A
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {selectedLineup.teamAPlayers.length} players
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={selectedLineup.teamAPlayers.map(p => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {selectedLineup.teamAPlayers.map((player) => (
                              <SortableItem
                                key={player.id}
                                player={player}
                                onEdit={handleEditPlayer}
                                onDelete={(id) => {
                                  setPlayerToDelete(id);
                                  setShowDeleteConfirm(true);
                                }}
                                disabled={selectedLineup.status === "COMPLETED"}
                              />
                            ))}
                          </div>
                        </SortableContext>
                        
                        <DragOverlay>
                          <DragOverlayItem player={draggedPlayer} />
                        </DragOverlay>
                      </DndContext>

                      {selectedLineup.teamAPlayers.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-lg">
                          <Users className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <p className="text-red-600 text-sm">No players in Team A</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Team B */}
                  <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-blue-900">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                          Team B
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {selectedLineup.teamBPlayers.length} players
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={selectedLineup.teamBPlayers.map(p => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {selectedLineup.teamBPlayers.map((player) => (
                              <SortableItem
                                key={player.id}
                                player={player}
                                onEdit={handleEditPlayer}
                                onDelete={(id) => {
                                  setPlayerToDelete(id);
                                  setShowDeleteConfirm(true);
                                }}
                                disabled={selectedLineup.status === "COMPLETED"}
                              />
                            ))}
                          </div>
                        </SortableContext>
                        
                        <DragOverlay>
                          <DragOverlayItem player={draggedPlayer} />
                        </DragOverlay>
                      </DndContext>

                      {selectedLineup.teamBPlayers.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
                          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-blue-600 text-sm">No players in Team B</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Lineup Selected
                  </h3>
                  <p className="text-gray-600">
                    Select a match from the sidebar to manage its lineup
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Player Dialog */}
      <Dialog open={showPlayerDialog} onOpenChange={setShowPlayerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlayer ? "Edit Player" : "Add New Player"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player Name *
              </label>
              <Input
                type="text"
                value={playerForm.name}
                onChange={(e) => handlePlayerInputChange("name", e.target.value)}
                placeholder="Enter player name"
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={playerForm.phone}
                onChange={(e) => handlePlayerInputChange("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <select
                  value={playerForm.position}
                  onChange={(e) => handlePlayerInputChange("position", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PLAYER">Player</option>
                  <option value="GK">Goalkeeper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team *
                </label>
                <select
                  value={playerForm.team}
                  onChange={(e) => handlePlayerInputChange("team", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="A">Team A</option>
                  <option value="B">Team B</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={playerForm.notes}
                onChange={(e) => handlePlayerInputChange("notes", e.target.value)}
                placeholder="Additional notes about the player..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPlayerDialog(false);
                  resetPlayerForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSavePlayer}
                className="flex items-center"
              >
                {editingPlayer ? "Update Player" : "Add Player"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setPlayerToDelete(null);
        }}
        onConfirm={handleDeletePlayer}
        title="Remove Player"
        message="Are you sure you want to remove this player from the lineup? This action cannot be undone."
        type="danger"
        confirmText="Remove"
        cancelText="Cancel"
      />
    </>
  );
}
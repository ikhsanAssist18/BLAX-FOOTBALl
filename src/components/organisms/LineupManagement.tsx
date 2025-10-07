"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Trophy,
  Clock,
  MapPin,
  Calendar,
  Search,
  Phone,
  Shield,
  Target,
  ChevronDown,
  ChevronUp,
  Filter,
  GripVertical,
} from "lucide-react";
import Button from "../atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Badge from "../atoms/Badge";
import { useNotifications } from "./NotificationContainer";
import { formatDate } from "@/lib/helper";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
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

interface PlayerCardProps {
  player: LineupPlayer;
  index: number;
}

interface SortablePlayerCardProps {
  player: LineupPlayer;
  index: number;
}

function SortablePlayerCard({ player, index }: SortablePlayerCardProps) {
  const [expanded, setExpanded] = useState(false);
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        isDragging ? "opacity-50 ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none hover:bg-gray-100 rounded p-1 transition-colors"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                  player.position === "GK"
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-sky-400 to-blue-500"
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-semibold text-gray-900 text-base truncate">
                  {player.name}
                </h4>
                <Badge
                  className={`text-xs font-medium ${
                    player.position === "GK"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}
                >
                  {player.position === "GK" ? "Goalkeeper" : "Player"}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-medium">{player.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Position #{index + 1}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {player.notes && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {expanded && player.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {player.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerCard({ player, index }: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden opacity-50">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 p-1">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                  player.position === "GK"
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-sky-400 to-blue-500"
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-semibold text-gray-900 text-base truncate">
                  {player.name}
                </h4>
                <Badge
                  className={`text-xs font-medium ${
                    player.position === "GK"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}
                >
                  {player.position === "GK" ? "Goalkeeper" : "Player"}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="font-medium">{player.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Position #{index + 1}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {player.notes && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {expanded && player.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {player.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LineupManagement() {
  const [lineups, setLineups] = useState<LineupMatch[]>([]);
  const [selectedLineup, setSelectedLineup] = useState<LineupMatch | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedTeamA, setExpandedTeamA] = useState(true);
  const [expandedTeamB, setExpandedTeamB] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<"A" | "B" | null>(null);

  const { showError, showSuccess } = useNotifications();

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
              notes: "Experienced goalkeeper with excellent reflexes",
            },
            {
              id: "p2",
              name: "Jane Smith",
              phone: "08987654321",
              position: "PLAYER",
              team: "A",
              order: 2,
            },
            {
              id: "p3",
              name: "Mike Johnson",
              phone: "08555666777",
              position: "PLAYER",
              team: "A",
              order: 3,
              notes: "Strong defender, prefers left side",
            },
            {
              id: "p7",
              name: "Robert Taylor",
              phone: "08777888999",
              position: "PLAYER",
              team: "A",
              order: 4,
            },
            {
              id: "p8",
              name: "Emily Davis",
              phone: "08666777888",
              position: "PLAYER",
              team: "A",
              order: 5,
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
            },
            {
              id: "p5",
              name: "David Brown",
              phone: "08444555666",
              position: "PLAYER",
              team: "B",
              order: 2,
              notes: "Fast winger with good ball control",
            },
            {
              id: "p6",
              name: "Chris Anderson",
              phone: "08222333444",
              position: "PLAYER",
              team: "B",
              order: 3,
            },
          ],
          createdAt: "2025-01-15T10:00:00Z",
          updatedAt: "2025-01-15T10:00:00Z",
        },
        {
          id: "2",
          scheduleName: "Weekend Tournament - January 25",
          venue: "Sports Complex Arena",
          date: "2025-01-25",
          time: "15:00",
          status: "CONFIRMED",
          totalPlayers: 20,
          teamAPlayers: [
            {
              id: "p9",
              name: "Alex Martinez",
              phone: "08123123123",
              position: "GK",
              team: "A",
              order: 1,
            },
            {
              id: "p10",
              name: "Lisa Chen",
              phone: "08234234234",
              position: "PLAYER",
              team: "A",
              order: 2,
            },
          ],
          teamBPlayers: [
            {
              id: "p11",
              name: "Tom Garcia",
              phone: "08345345345",
              position: "GK",
              team: "B",
              order: 1,
            },
            {
              id: "p12",
              name: "Anna Rodriguez",
              phone: "08456456456",
              position: "PLAYER",
              team: "B",
              order: 2,
            },
          ],
          createdAt: "2025-01-16T14:00:00Z",
          updatedAt: "2025-01-18T10:00:00Z",
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

    if (selectedLineup) {
      const playerInA = selectedLineup.teamAPlayers.find(
        (p) => p.id === active.id
      );
      const playerInB = selectedLineup.teamBPlayers.find(
        (p) => p.id === active.id
      );
      setActiveTeam(playerInA ? "A" : playerInB ? "B" : null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !selectedLineup) return;

    const overId = over.id as string;
    const activePlayerId = active.id as string;

    if (overId === "team-a-droppable" || overId === "team-b-droppable") {
      const targetTeam = overId === "team-a-droppable" ? "A" : "B";
      const sourceTeam = activeTeam;

      if (sourceTeam && sourceTeam !== targetTeam) {
        const updatedLineup = { ...selectedLineup };
        let movedPlayer: LineupPlayer | undefined;

        if (sourceTeam === "A") {
          const playerIndex = updatedLineup.teamAPlayers.findIndex(
            (p) => p.id === activePlayerId
          );
          if (playerIndex !== -1) {
            movedPlayer = { ...updatedLineup.teamAPlayers[playerIndex] };
            updatedLineup.teamAPlayers.splice(playerIndex, 1);
          }
        } else {
          const playerIndex = updatedLineup.teamBPlayers.findIndex(
            (p) => p.id === activePlayerId
          );
          if (playerIndex !== -1) {
            movedPlayer = { ...updatedLineup.teamBPlayers[playerIndex] };
            updatedLineup.teamBPlayers.splice(playerIndex, 1);
          }
        }

        if (movedPlayer) {
          movedPlayer.team = targetTeam;
          if (targetTeam === "A") {
            movedPlayer.order = updatedLineup.teamAPlayers.length + 1;
            updatedLineup.teamAPlayers.push(movedPlayer);
          } else {
            movedPlayer.order = updatedLineup.teamBPlayers.length + 1;
            updatedLineup.teamBPlayers.push(movedPlayer);
          }

          setSelectedLineup(updatedLineup);
          setLineups(
            lineups.map((l) => (l.id === updatedLineup.id ? updatedLineup : l))
          );
          setActiveTeam(targetTeam);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !selectedLineup) return;

    const activePlayerId = active.id as string;
    const overPlayerId = over.id as string;

    if (activePlayerId === overPlayerId) return;

    const updatedLineup = { ...selectedLineup };

    const activeInTeamA = updatedLineup.teamAPlayers.find(
      (p) => p.id === activePlayerId
    );
    const activeInTeamB = updatedLineup.teamBPlayers.find(
      (p) => p.id === activePlayerId
    );
    const overInTeamA = updatedLineup.teamAPlayers.find(
      (p) => p.id === overPlayerId
    );
    const overInTeamB = updatedLineup.teamBPlayers.find(
      (p) => p.id === overPlayerId
    );

    if (activeInTeamA && overInTeamA) {
      const oldIndex = updatedLineup.teamAPlayers.findIndex(
        (p) => p.id === activePlayerId
      );
      const newIndex = updatedLineup.teamAPlayers.findIndex(
        (p) => p.id === overPlayerId
      );
      updatedLineup.teamAPlayers = arrayMove(
        updatedLineup.teamAPlayers,
        oldIndex,
        newIndex
      );
      updatedLineup.teamAPlayers = updatedLineup.teamAPlayers.map((p, i) => ({
        ...p,
        order: i + 1,
      }));

      setSelectedLineup(updatedLineup);
      setLineups(
        lineups.map((l) => (l.id === updatedLineup.id ? updatedLineup : l))
      );
      showSuccess("Player reordered successfully");
    } else if (activeInTeamB && overInTeamB) {
      const oldIndex = updatedLineup.teamBPlayers.findIndex(
        (p) => p.id === activePlayerId
      );
      const newIndex = updatedLineup.teamBPlayers.findIndex(
        (p) => p.id === overPlayerId
      );
      updatedLineup.teamBPlayers = arrayMove(
        updatedLineup.teamBPlayers,
        oldIndex,
        newIndex
      );
      updatedLineup.teamBPlayers = updatedLineup.teamBPlayers.map((p, i) => ({
        ...p,
        order: i + 1,
      }));

      setSelectedLineup(updatedLineup);
      setLineups(
        lineups.map((l) => (l.id === updatedLineup.id ? updatedLineup : l))
      );
      showSuccess("Player reordered successfully");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-green-700 border-green-200";
      case "DRAFT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Clock className="w-4 h-4" />;
      case "COMPLETED":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const activeDragPlayer = selectedLineup
    ? [...selectedLineup.teamAPlayers, ...selectedLineup.teamBPlayers].find(
        (p) => p.id === activeId
      )
    : null;

  const filteredLineups = lineups.filter((lineup) => {
    const matchesSearch =
      !searchTerm ||
      lineup.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lineup.venue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lineup.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-3 w-full sm:w-auto">
            <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="h-[600px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
          <div className="lg:col-span-8">
            <div className="h-[600px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Lineup Management
          </h2>
          <p className="text-gray-600">
            View and explore player lineups for all scheduled matches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card className="shadow-lg border-gray-200 sticky top-6">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                Match Lineups
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search matches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white transition-all cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredLineups.map((lineup) => (
                  <button
                    key={lineup.id}
                    onClick={() => setSelectedLineup(lineup)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedLineup?.id === lineup.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
                          {lineup.scheduleName}
                        </h4>
                        <Badge
                          className={`text-xs font-medium flex items-center gap-1 flex-shrink-0 ${getStatusColor(
                            lineup.status
                          )}`}
                        >
                          {getStatusIcon(lineup.status)}
                          {lineup.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{lineup.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span>
                            {formatDate(lineup.date)} • {lineup.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span className="font-medium">
                            {lineup.totalPlayers} players
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredLineups.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No lineups found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {selectedLineup ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
            <div className="space-y-6">
              <Card className="shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedLineup.scheduleName}
                        </h3>
                        <Badge
                          className={`font-medium flex items-center gap-1.5 ${getStatusColor(
                            selectedLineup.status
                          )}`}
                        >
                          {getStatusIcon(selectedLineup.status)}
                          {selectedLineup.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">
                            {selectedLineup.venue}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">
                            {formatDate(selectedLineup.date)} • {selectedLineup.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">
                            {selectedLineup.totalPlayers} players total
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <GripVertical className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Drag & Drop Enabled
                    </p>
                    <p className="text-sm text-blue-700">
                      Drag players to reorder them within a team or move them between Team A and Team B
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white overflow-hidden">
                  <CardHeader className="border-b border-rose-100 bg-rose-50/50">
                    <button
                      onClick={() => setExpandedTeamA(!expandedTeamA)}
                      className="w-full"
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-md flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="text-gray-900 font-bold">
                              Team A
                            </div>
                            <div className="text-xs font-normal text-gray-600">
                              {selectedLineup.teamAPlayers.length} players
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-rose-100 text-rose-700 font-semibold">
                            {selectedLineup.teamAPlayers.length}
                          </Badge>
                          {expandedTeamA ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </CardTitle>
                    </button>
                  </CardHeader>
                  {expandedTeamA && (
                    <CardContent className="p-4">
                      <SortableContext
                        items={selectedLineup.teamAPlayers.map((p) => p.id)}
                        strategy={verticalListSortingStrategy}
                        id="team-a-droppable"
                      >
                        <div className="space-y-3 min-h-[200px] transition-colors">
                          {selectedLineup.teamAPlayers.length > 0 ? (
                            selectedLineup.teamAPlayers.map((player, index) => (
                              <SortablePlayerCard
                                key={player.id}
                                player={player}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="text-center py-12 border-2 border-dashed border-rose-200 rounded-xl bg-rose-50/30">
                              <Users className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                              <p className="text-rose-600 font-medium">
                                No players in Team A
                              </p>
                              <p className="text-rose-500 text-sm mt-1">
                                Drop players here
                              </p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </CardContent>
                  )}
                </Card>

                <Card className="shadow-lg border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white overflow-hidden">
                  <CardHeader className="border-b border-sky-100 bg-sky-50/50">
                    <button
                      onClick={() => setExpandedTeamB(!expandedTeamB)}
                      className="w-full"
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="text-gray-900 font-bold">
                              Team B
                            </div>
                            <div className="text-xs font-normal text-gray-600">
                              {selectedLineup.teamBPlayers.length} players
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-sky-100 text-sky-700 font-semibold">
                            {selectedLineup.teamBPlayers.length}
                          </Badge>
                          {expandedTeamB ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </CardTitle>
                    </button>
                  </CardHeader>
                  {expandedTeamB && (
                    <CardContent className="p-4">
                      <SortableContext
                        items={selectedLineup.teamBPlayers.map((p) => p.id)}
                        strategy={verticalListSortingStrategy}
                        id="team-b-droppable"
                      >
                        <div className="space-y-3 min-h-[200px] transition-colors">
                          {selectedLineup.teamBPlayers.length > 0 ? (
                            selectedLineup.teamBPlayers.map((player, index) => (
                              <SortablePlayerCard
                                key={player.id}
                                player={player}
                                index={index}
                              />
                            ))
                          ) : (
                            <div className="text-center py-12 border-2 border-dashed border-sky-200 rounded-xl bg-sky-50/30">
                              <Users className="w-12 h-12 text-sky-300 mx-auto mb-3" />
                              <p className="text-sky-600 font-medium">
                                No players in Team B
                              </p>
                              <p className="text-sky-500 text-sm mt-1">
                                Drop players here
                              </p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </CardContent>
                  )}
                </Card>
              </div>

              <DragOverlay>
                {activeId && activeDragPlayer ? (
                  <PlayerCard player={activeDragPlayer} index={0} />
                ) : null}
              </DragOverlay>
            </div>
            </DndContext>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-16 text-center">
                <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Lineup Selected
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a match from the sidebar to view its lineup details
                  and player information
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

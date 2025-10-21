"use client";

import { useState, useEffect } from "react";
import { useTripStore } from "@/lib/store/tripStore";
import type { InfoCard, CardType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CARD_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import {
  Activity,
  Utensils,
  Car,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Tag,
  Link2,
  X,
  Navigation,
  Globe,
  Plane,
  Hotel,
  ShoppingBag,
  Ticket,
  Circle,
} from "lucide-react";

interface CardDetailModalProps {
  card: InfoCard;
  tripId: string;
  dayId: string;
  open: boolean;
  onClose: () => void;
}

export function CardDetailModal({
  card,
  tripId,
  dayId,
  open,
  onClose,
}: CardDetailModalProps) {
  const updateCard = useTripStore((state) => state.updateCard);

  const [title, setTitle] = useState(card.title);
  const [startTime, setStartTime] = useState(card.startTime || "");
  const [endTime, setEndTime] = useState(card.endTime || "");
  const [location, setLocation] = useState(card.location?.name || "");
  const [address, setAddress] = useState(card.location?.address || "");
  const [notes, setNotes] = useState(card.notes || "");
  const [cost, setCost] = useState(card.cost?.amount.toString() || "");
  const [currency, setCurrency] = useState(card.cost?.currency || "USD");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(card.tags || []);
  const [links, setLinks] = useState<string[]>(card.links || []);
  const [linkInput, setLinkInput] = useState("");
  const [status, setStatus] = useState(card.status);
  const [thumbnail, setThumbnail] = useState(card.thumbnail || "");

  // Reset form when card changes
  useEffect(() => {
    setTitle(card.title);
    setStartTime(card.startTime || "");
    setEndTime(card.endTime || "");
    setLocation(card.location?.name || "");
    setAddress(card.location?.address || "");
    setNotes(card.notes || "");
    setCost(card.cost?.amount.toString() || "");
    setCurrency(card.cost?.currency || "USD");
    setTags(card.tags || []);
    setLinks(card.links || []);
    setStatus(card.status);
    setThumbnail(card.thumbnail || "");
  }, [card]);

  const handleSave = () => {
    updateCard(tripId, dayId, card.id, {
      title,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location
        ? {
            name: location,
            address: address || undefined,
          }
        : undefined,
      notes: notes || undefined,
      cost: cost
        ? {
            amount: parseFloat(cost),
            currency,
          }
        : undefined,
      tags,
      links,
      status,
      thumbnail: thumbnail || undefined,
    });
    toast.success("Card updated");
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddLink = () => {
    if (linkInput.trim() && !links.includes(linkInput.trim())) {
      setLinks([...links, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const handleRemoveLink = (link: string) => {
    setLinks(links.filter((l) => l !== link));
  };

  const handleLearnMore = () => {
    const query = location ? `${title} ${location}` : title;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  const handleNavigate = () => {
    const query = address || location || title;
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  const cardType = CARD_TYPES[card.type];

  const getTypeIcon = (type: CardType) => {
    const icons = {
      activity: Activity,
      meal: Utensils,
      restaurant: Utensils,
      transit: Car,
      flight: Plane,
      hotel: Hotel,
      shopping: ShoppingBag,
      entertainment: Ticket,
      note: FileText,
    };
    return icons[type];
  };

  const TypeIcon = getTypeIcon(card.type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{cardType.icon}</span>
            <span>{cardType.label}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Title</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLearnMore}
                className="h-7"
              >
                <Globe className="w-3 h-3 mr-1.5" />
                Learn More
              </Button>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Activity title..."
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Booking Status</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "pending", label: "Pending", color: "bg-gray-300" },
                { value: "todo", label: "To Do", color: "bg-gray-400" },
                {
                  value: "tentative",
                  label: "Tentative",
                  color: "bg-amber-500",
                },
                { value: "booked", label: "Booked", color: "bg-blue-500" },
                {
                  value: "confirmed",
                  label: "Confirmed",
                  color: "bg-green-500",
                },
                {
                  value: "completed",
                  label: "Completed",
                  color: "bg-gray-500",
                },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value as any)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md border-2 text-sm font-medium transition-all
                    ${
                      status === value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300 bg-background"
                    }
                  `}
                >
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Start Time
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                End Time
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location
              </label>
              {(location || address) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleNavigate}
                  className="h-7"
                >
                  <Navigation className="w-3 h-3 mr-1.5" />
                  Navigate
                </Button>
              )}
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Place name..."
            />
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address (optional)..."
              className="text-sm"
            />
          </div>

          {/* Cost */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Cost
              </label>
              <Input
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
                maxLength={3}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes, tips, or details..."
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Add a tag..."
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-muted-foreground/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Links
            </label>
            <div className="flex gap-2">
              <Input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddLink())
                }
                placeholder="https://..."
                type="url"
              />
              <Button type="button" onClick={handleAddLink} size="sm">
                Add
              </Button>
            </div>
            <div className="space-y-1">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex-1 truncate"
                  >
                    {link}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveLink(link)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

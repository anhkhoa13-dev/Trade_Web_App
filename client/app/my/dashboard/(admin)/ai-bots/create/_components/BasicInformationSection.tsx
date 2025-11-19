"use client";

import { Label } from "@/app/ui/shadcn/label";
import { Input } from "@/app/ui/shadcn/input";
import { Textarea } from "@/app/ui/shadcn/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/ui/shadcn/select";
import { TagInput } from "@/app/ui/my_components/Input/TagInput";
import { SectionCard } from "@/app/ui/my_components/Card/SectionCard";
import { RiskLevel } from "@/entities/mockAdminAiBots";

interface Props {
  name: string;
  setName: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  category: string;
  setCategory: (v: string) => void;

  tags: string[];
  setTags: (v: string[]) => void;

  riskLevel: RiskLevel;
  setRiskLevel: (v: RiskLevel) => void;
}

export function BasicInformationSection({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  riskLevel,
  setRiskLevel,
}: Props) {
  return (
    <SectionCard title="Basic Information">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Bot Name *</Label>
          <Input
            placeholder="Alpha Trend Pro"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AI Predictive">AI Predictive</SelectItem>
              <SelectItem value="Trend Following">Trend Following</SelectItem>
              <SelectItem value="DCA">DCA</SelectItem>
              <SelectItem value="Scalping">Scalping</SelectItem>
              <SelectItem value="Grid Trading">Grid Trading</SelectItem>
              <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
              <SelectItem value="Arbitrage">Arbitrage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the bot strategy…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput
          tags={tags}
          onAdd={(tag) => setTags([...tags, tag])}
          onRemove={(tag) => setTags(tags.filter((t) => t !== tag))}
        />
      </div>

      <div className="space-y-2">
        <Label>Risk Level</Label>
        <Select value={riskLevel} onValueChange={setRiskLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </SectionCard>
  );
}

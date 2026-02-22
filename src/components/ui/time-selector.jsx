import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TimeSelector({ onHourChange, onMinuteChange }) {
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            {/* Hour Selector */}
            <div>
                <Select onValueChange={onHourChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Minute Selector */}
            <div>
                <Select onValueChange={onMinuteChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

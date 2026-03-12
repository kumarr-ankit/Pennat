"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function SearchButton() {
	const naviagtors = useNavigate();

	const [open, setOpen] = React.useState(false);
	const [placeholder, setPlaceholder] = React.useState(
		"Search anything in mind"
	);

	function goSearch(text) {
		naviagtors(`/search?q=${text}`, {
			replace: true,
		});

	
		setOpen(false);
	}

	return (
		<div className=" flex   flex-col">
			<Button
				onClick={() => setOpen(true)}
				variant="ghost"
				className="w-fit mb-1 cursor-pointer">
				<Search size={30} strokeWidth={3} />
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				className="top-9  left-[48%] sm:left-1/2  ">
				<Command>
					<CommandInput
						onKeyDown={(e) => {
							if (e.key == "Enter") {
								goSearch(e.target.value);
							}
						}}
						placeholder={placeholder}
					/>
					{/* <CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions are not available.">
							<CommandItem>Calendar</CommandItem>
							<CommandItem>Search Emoji</CommandItem>
							<CommandItem>Calculator</CommandItem>
						</CommandGroup>
					</CommandList> */}
				</Command>
			</CommandDialog>
		</div>
	);
}

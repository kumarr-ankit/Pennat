import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon, UserX } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { themeContext, userContext } from "../context/Context";
import supabase from "../config/supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function AlertDialogDestructive() {
	const navigate = useNavigate();
	const [isDark] = useContext(themeContext);
	const [info] = useContext(userContext);

	console.log(info);
	const [input, setInput] = useState();
	const inputRef = useRef();
	const [active, setActive] = useState(false);
	let token = localStorage.getItem("userTokenPennat");

	useEffect(() => {
		console.log(info);

		if (!info && !token) navigate("/auth");
	}, []);

	async function handleDelete() {
		try {
			const { error: deleteError } = await supabase
				.from("UserTable")
				.delete()
				.eq("username", info?.username);

			if (deleteError) {
				console.log(deleteError);
				toast("Error occurred while deleting account.");
				return;
			}

			const { error: authError } = await supabase.auth.signOut();

			if (authError) {
				console.log(authError);
				toast("Error occurred while deleting account.");
				return;
			}

			toast("Successfully deleted account.");
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			console.error(err);
			toast("Unexpected error occurred.");
		}
	}
	let str = info ? info?.username : "delete my account";
									str = str.toLowerCase();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="cursor-pointer text-sm">
					<div>Delete your account</div>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent
				size="sm"
				className={`${isDark} bg-background text-foreground border outline`}>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<UserX />
					</AlertDialogMedia>
					<AlertDialogTitle>
						<div> Delete account?</div>
					</AlertDialogTitle>
					<AlertDialogDescription className="bg-background">
						{!input ? (
							`This will permanently delete your account. Everything will be
						deleted shared in this account.`
						) : (
							<div>
								Enter{" "}
								<span className="font-semibold underline select-none text-red-600">
									{str}
								</span>{" "}
								to permanentaly delete account.
							</div>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{!input && (
						<>
							<AlertDialogCancel
								variant="outline"
								className="bg-background cursor-pointer">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								className="bg-background cursor-pointer"
								onClick={(e) => {
									e.preventDefault();
									setInput(true);
								}}>
								Delete
							</AlertDialogAction>
						</>
					)}

					{input && (
						<div className="flex ml-2">
							<input
								ref={inputRef}
								className={`outline rounded-sm mx-1 pl-2 text-sm `}
								onChange={(e) => {
									console.log({ active: active });

								
									let inputStr = e.target.value.toString().toLowerCase();

									inputStr.trimEnd();

									if (inputStr == str) {
										setActive(true);
									} else {
										setActive(false);
									}
								}}
								placeholder="Write as it is "
							/>
							<button
								disabled={!active}
								onClick={handleDelete}
								className={`border disabled:cursor-not-allowed cursor-pointer  p-2 bg-red-500 disabled:bg-transparent rounded-md`}>
								Delete
							</button>
						</div>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

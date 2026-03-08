import { Eclipse, EclipseIcon, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import { userDp } from "../../public/avtar";
import { dateFormmater } from "./DateFormatter";

function CommentCard({ comment, deleteComment, user_id }) {
	const { UserTable: commenter } = comment;
	const {created_at} = comment;
	let date = Date.parse(created_at);
	
	const [menuOpen, setMenuOpen] = useState();
	function handleDelete(e) {
		e.stopPropagation();
		deleteComment(comment.id, comment);
	}

	return (
		<div className="pb-4 my-4">
			<div className="flex justify-between ">
				<div className="flex items-center mt-1 ">
					<img src={commenter?.profile_img ?? userDp} className="h-10  mx-2 rounded-full" />

					<div className="ml-2">
						<span className="text-sm items-center  flex   text-gray-500">
							<span className="text-center font-semibold  text-foreground">{'@'+ commenter?.username}</span>
							<span className="text-xs pl-3 text-center">{dateFormmater(created_at)}</span>
						</span>
						
						<div className=" border-b-gray-300 text-foreground mt-1 ml-1">{comment.comment}</div>
					</div>
				</div>
				<div>
					{user_id == comment.user_id && (
						<div
							className="relative
                ">
							<Ellipsis
								className={`cursor-pointer rounded-4xl rotate-90 mt-2 active:bg-gray-300`}
								size={20}
								onClick={() => {
									setMenuOpen((p) => !p);
								}}
							/>
							<div className="absolute    right-4 top-2 p-1">
								<ul>
									<li className={`${menuOpen ? "" : "hidden"} transition `}>
										<button
											className="text-red-600 bg-red-100 dark:bg-red-500 dark:text-black  border rounded-md  px-3 py-1 border-red-800 dark:border-red-800"
											onClick={handleDelete}>
											Delete
										</button>
									</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CommentCard;

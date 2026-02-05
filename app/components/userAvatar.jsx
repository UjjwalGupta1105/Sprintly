import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

const UserAvatar = ({ user, size = "md" }) => {
  return (
    <Avatar className={sizeMap[size]}>
      <AvatarImage src={user?.imageUrl} alt={user?.name ?? "User"} />
      <AvatarFallback className="capitalize text-xs">
        {user?.name?.charAt(0) ?? "?"}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar

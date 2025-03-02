"use client"
import { useCurrentUser } from "@/hooks/use-current-user"
import { signOut } from "next-auth/react"

const SettingsPage = () => {
const user = useCurrentUser()

const onClick = () => {
  signOut()
}

  return (
    <div className="bg-white rounded-xl p-10">
      <h1 className="text-2xl font-bold">Hello {user?.name}</h1>
      <br />
      <button onClick={onClick} type="submit">Sign out</button>
    </div>
  )
}
export default SettingsPage
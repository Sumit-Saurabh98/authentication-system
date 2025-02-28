import {auth} from "@/auth"

const SettingsPage = async () => {

    const session = await auth()

  return (
    <div>
        <pre>{JSON.stringify(session)}</pre>
    </div>
  )
}
export default SettingsPage
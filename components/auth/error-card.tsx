import { AlertTriangle } from "lucide-react"
import { CardWrapper } from "./card-wrapper"

export const ErrorCard = () => {
  return (
    <CardWrapper 
        headerLabel="Oops! Something went wrong"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        showSocial={false}
    >
        <div className="w-full flex items-center justify-center gap-x-2">
        <AlertTriangle className="text-destructive"/>
        </div>
    </CardWrapper>
  )
}
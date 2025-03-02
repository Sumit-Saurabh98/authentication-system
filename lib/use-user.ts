import { auth } from "@/auth";

export const currentUser = async () =>{
    const session = await auth();

    return session?.user
}

// this you can use in any component, check hooks->use-current-user for example to use it in a client component
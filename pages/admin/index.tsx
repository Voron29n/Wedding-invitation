import {getSession} from "next-auth/react";
import {AuthUser} from "@types";

export async function getServerSideProps(context: any) {
    const session = await getSession(context)
    const isAdmin = (session?.user as AuthUser)?.role === 'admin'
    return {
        redirect: {
            destination: isAdmin ? '/admin/guests' : '/admin/login',  // redirect destination path
            permanent: false,
        },
    }
}


export default function Admin() {
    return (
        <main>
            <div>
                <h1>Admin Page</h1>
            </div>
        </main>
    );
};

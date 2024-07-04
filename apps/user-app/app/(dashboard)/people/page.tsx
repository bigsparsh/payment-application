"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getTransactionUsers, getUserList } from "@/lib/actions/user";
import { User } from "@prisma/client";
import { Handshake, UserRoundX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Component() {
  const router = useRouter();
  const session = useSession();
  const [usersList, setUsersList] = useState<User[]>();
  const [paidUsersEmails, setPaidUsersEmails] = useState<string[]>();
  useEffect(() => {
    if (session.status === "loading") {
      return;
    }

    gets();
  }, [session]);

  const gets = async () => {
    setUsersList(await getUserList());
    setPaidUsersEmails(
      (await getTransactionUsers()).map((ele) => ele.to_user.email),
    );
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-6">Previously Paid Users</h2>
          <div className="space-y-4">
            {usersList?.length == 0 ? (
              <div className="flex gap-3 text-destructive px-5">
                <Handshake /> You have made no transactions yet
              </div>
            ) : (
              usersList?.map((user) => {
                if (!paidUsersEmails?.includes(user.email)) return;
                return (
                  <div
                    className="flex items-center justify-between bg-muted p-4 rounded-lg"
                    key={user.user_id}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 ">
                        <AvatarImage src={user.profile_image as string} />
                        <AvatarFallback className="bg-primary">
                          {user?.name.split(" ")[0][0].toUpperCase()}
                          {user?.name.split(" ")[1]?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => {
                        router.push(`/chat/${user.user_id}`);
                      }}
                    >
                      Contact
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">New Users</h2>
          <div className="space-y-4">
            {usersList?.length == 0 ? (
              <div className="flex gap-3 text-destructive px-5">
                <UserRoundX /> There are no users
              </div>
            ) : (
              usersList?.map((user) => {
                if (paidUsersEmails?.includes(user.email)) return;
                return (
                  <div
                    className="flex items-center justify-between bg-muted p-4 rounded-lg"
                    key={user.user_id}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profile_image as string} />
                        <AvatarFallback>
                          {user?.name.split(" ")[0][0].toUpperCase()}
                          {user?.name.split(" ")[1]?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground">
                          {user.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined 2 days ago
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          router.push(`/profile/${user.user_id}`);
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          router.push(`/chat/${user.user_id}`);
                        }}
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

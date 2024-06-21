import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserById } from "@/lib/actions/user";

export default async function Component({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const user = await getUserById(params.userId);
  if (!user) {
    return (
      <div className="text-destructive w-full h-full grid place-items-center text-3xl">
        User not found
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <div className="mt-4 grid gap-4">
              <div className="flex items-center justify-between rounded-md bg-muted p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">
                      May 15, 2023
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500">+$50.00</p>
                  <p className="text-sm text-muted-foreground">
                    Payment Received
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Chen</p>
                    <p className="text-sm text-muted-foreground">
                      April 30, 2023
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-500">-$25.00</p>
                  <p className="text-sm text-muted-foreground">Payment Sent</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Emily Martinez</p>
                    <p className="text-sm text-muted-foreground">
                      April 20, 2023
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500">+$75.00</p>
                  <p className="text-sm text-muted-foreground">
                    Payment Received
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

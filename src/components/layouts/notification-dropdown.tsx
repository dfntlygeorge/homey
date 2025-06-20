"use client";

import { Notification, NotificationType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Circle, Check, ExternalLink } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface NotificationDropdownProps {
  notifications: Notification[];
  onNotificationClick?: (id: number) => Promise<void>;
  onMarkAllAsRead?: () => Promise<void>;
  onNotificationUpdate?: (notifications: Notification[]) => void;
}

export const NotificationDropdown = (props: NotificationDropdownProps) => {
  const { onNotificationClick, onMarkAllAsRead, onNotificationUpdate } = props;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(
    props.notifications
  );

  // Sync with parent when props change
  useEffect(() => {
    setNotifications(props.notifications);
  }, [props.notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (open && showBadge) {
      setShowBadge(false);
    }
  }, [open, showBadge]);

  const handleNotificationClick = async (notification: Notification) => {
    if (isPending) return;

    // Optimistically update local state
    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);

    // Update parent component state
    onNotificationUpdate?.(updatedNotifications);

    // Perform server action
    startTransition(async () => {
      try {
        await onNotificationClick?.(notification.id);

        // Navigate after successful update
        if (
          notification.type === NotificationType.LISTING &&
          notification.listingId
        ) {
          router.push(`/listings/${notification.listingId}`);
        } else {
          router.push("/");
        }
      } catch (error) {
        // Revert optimistic update on error
        setNotifications(props.notifications);
        onNotificationUpdate?.(props.notifications);
        console.error("Failed to mark notification as read:", error);
      }
    });

    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    if (isPending) return;

    // Optimistically update local state
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));
    setNotifications(updatedNotifications);

    // Update parent component state
    onNotificationUpdate?.(updatedNotifications);

    // Perform server action
    startTransition(async () => {
      try {
        await onMarkAllAsRead?.();
      } catch (error) {
        // Revert optimistic update on error
        setNotifications(props.notifications);
        onNotificationUpdate?.(props.notifications);
        console.error("Failed to mark all notifications as read:", error);
      }
    });

    setOpen(false);
  };

  const getNotificationIcon = (type?: NotificationType) => {
    switch (type) {
      case NotificationType.LISTING:
        return <ExternalLink className="h-3 w-3 text-blue-500" />;
      case NotificationType.MESSAGE:
        return <Circle className="h-3 w-3 text-green-500" />;
      case NotificationType.ALERT:
        return <Circle className="h-3 w-3 text-red-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          disabled={isPending}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-hidden"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll notify you when something happens
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  onClick={() => handleNotificationClick(notification)}
                  disabled={isPending}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-blue-50 hover:bg-blue-100 border-l-2 border-l-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {!notification.read ? (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    ) : (
                      <div className="h-2 w-2 bg-transparent rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-5 ${
                          !notification.read
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    {notification.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.createdAt)}
                      </p>
                    )}
                  </div>
                </DropdownMenuItem>

                {index < notifications.length - 1 && (
                  <DropdownMenuSeparator className="my-0" />
                )}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => {
                  router.push("/");
                  setOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

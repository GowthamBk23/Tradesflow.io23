// This page adapts its content based on user role
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "@/components/settings/profile-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import ThemeSettings from "@/components/settings/theme-settings"
import SubscriptionSettings from "@/components/settings/subscription-settings"
import PermissionSettings from "@/components/settings/permission-settings"
import BillingHistory from "@/components/settings/billing-history"
import StorageUsage from "@/components/settings/storage-usage"
import ReferralProgram from "@/components/settings/referral-program"
import { useUser } from "@/contexts/user-context"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          {user?.role === "client" ? "Manage your account preferences" : "Manage your account settings and preferences"}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-background">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>

          {/* Admin-only tabs */}
          <PermissionGuard permission="manage:billing">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </PermissionGuard>

          <PermissionGuard permission="view:all">
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </PermissionGuard>

          <PermissionGuard permission="manage:users">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </PermissionGuard>

          <PermissionGuard permission="manage:billing">
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </PermissionGuard>

          {/* New Referral Program tab - Admin only */}
          <PermissionGuard permission="manage:billing">
            <TabsTrigger value="referral">Referral Program</TabsTrigger>
          </PermissionGuard>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <ThemeSettings />
        </TabsContent>

        <PermissionGuard permission="manage:billing">
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionSettings />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission="view:all">
          <TabsContent value="storage" className="space-y-4">
            <StorageUsage />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission="manage:users">
          <TabsContent value="permissions" className="space-y-4">
            <PermissionSettings />
          </TabsContent>
        </PermissionGuard>

        <PermissionGuard permission="manage:billing">
          <TabsContent value="billing" className="space-y-4">
            <BillingHistory />
          </TabsContent>
        </PermissionGuard>

        {/* New Referral Program content - Admin only */}
        <PermissionGuard permission="manage:billing">
          <TabsContent value="referral" className="space-y-4">
            <ReferralProgram />
          </TabsContent>
        </PermissionGuard>
      </Tabs>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useAuth, useSubscription } from '@/components/auth/auth-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Database } from '@/lib/types/database.types'
import { formatCurrency } from '@/lib/utils'
import axios from 'axios'
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  XCircle,
  ArrowRight,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ProtectedPage } from '@/components/auth/protected-page'

type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Price = Database['public']['Tables']['prices']['Row']
type Product = Database['public']['Tables']['products']['Row']

type SubscriptionWithDetails = Subscription & {
  price?: Price & {
    product?: Product
  }
}

const AccountPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="container max-w-5xl py-10 px-4 md:px-6 mx-auto">
    <h1 className="text-3xl font-bold mb-2 text-center">Account</h1>
    <p className="text-muted-foreground mb-8 text-center">Manage your account and subscription</p>
    <div className="grid gap-6">{children}</div>
  </div>
)

function AccountPage() {
  const { user } = useAuth()
  const { subscription, subscriptionLoading } = useSubscription()

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-gray-600 hover:bg-gray-600">
            Active
          </Badge>
        )
      case 'canceled':
        return (
          <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
            Canceled
          </Badge>
        )
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>
      case 'incomplete':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Incomplete
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string | null) => {
    if (!status) return <AlertCircle className="h-5 w-5 text-muted-foreground" />

    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'canceled':
        return <XCircle className="h-5 w-5 text-orange-500" />
      case 'past_due':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case 'incomplete':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const handleCancelSubscription = async () => {
    // This will be implemented later
    toast.info('Subscription cancellation will be implemented soon')
  }

  if (subscriptionLoading) {
    return (
      <AccountPageWrapper>
        {/* Use absolutely minimal skeletons with fixed heights to match actual content */}
        <div className="h-[480px] mb-6 relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent opacity-10 animate-pulse" />
        </div>

        <div className="h-[220px] relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent opacity-10 animate-pulse" />
        </div>
      </AccountPageWrapper>
    )
  }

  return (
    <AccountPageWrapper>
      {subscription ? (
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-card pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle>{subscription.price?.product?.name || 'Subscription'}</CardTitle>
                  {getStatusBadge(subscription.status)}
                </div>
                <CardDescription>Manage your subscription and billing details</CardDescription>
              </div>
              <div className="flex items-center justify-end">
                {subscription.price && (
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(subscription.price.unit_amount || 0, subscription.price.currency || 'USD')}
                    </p>
                    <p className="text-sm text-muted-foreground">per {subscription.price.interval || 'month'}</p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="p-6 bg-primary/5 border-y">
              <div className="flex items-start gap-2 text-sm mb-1">
                {getStatusIcon(subscription.status)}
                <div>
                  <p className="font-medium">
                    {subscription.status === 'active' &&
                      !subscription.cancel_at_period_end &&
                      'Your subscription is active'}
                    {subscription.status === 'active' &&
                      subscription.cancel_at_period_end &&
                      'Your subscription is set to cancel'}
                    {subscription.status === 'canceled' && 'Your subscription has been canceled'}
                    {subscription.status === 'past_due' && 'Your payment is past due'}
                    {subscription.status === 'incomplete' && 'Your subscription setup is incomplete'}
                    {!['active', 'canceled', 'past_due', 'incomplete'].includes(subscription.status || '') &&
                      'Subscription status: ' + subscription.status}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {subscription.status === 'active' &&
                      !subscription.cancel_at_period_end &&
                      `Next payment on ${new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`}
                    {subscription.status === 'active' &&
                      subscription.cancel_at_period_end &&
                      `Access until ${new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`}
                    {subscription.status === 'canceled' && 'Your subscription has ended'}
                    {subscription.status === 'past_due' && 'Please update your payment method'}
                    {subscription.status === 'incomplete' && 'Please complete your subscription setup'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Package className="h-4 w-4" />
                    <span>Plan Details</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Plan: </span>
                      <span className="font-medium">{subscription.price?.product?.name || 'Unknown Plan'}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Description: </span>
                      <span>{subscription.price?.product?.description || 'No description available'}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Started on: </span>
                      <span>
                        {new Date(subscription.created).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing Information</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-medium">
                        {subscription.price
                          ? `${formatCurrency(subscription.price.unit_amount || 0, subscription.price.currency || 'USD')} / ${subscription.price.interval || 'month'}`
                          : 'N/A'}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Current period: </span>
                      <span>
                        {new Date(subscription.current_period_start).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Renewal date: </span>
                      <span className="font-medium">
                        {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {subscription.cancel_at_period_end && (
                <Alert variant="warning" className="bg-orange-50 text-orange-800 border-orange-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Subscription Ending</AlertTitle>
                  <AlertDescription>
                    Your subscription will end on{' '}
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    . You will lose access to premium features after this date.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-6 py-4 border-t bg-muted/10 flex flex-col sm:flex-row sm:items-center gap-4">
            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
              <>
                <Button variant="destructive" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    Change Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
            {subscription.status === 'active' && subscription.cancel_at_period_end && (
              <Button variant="default">Resume Subscription</Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>Upgrade to a paid plan to access premium features and increased limits</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4">
              <Alert>
                <Package className="h-4 w-4" />
                <AlertTitle>Free Tier</AlertTitle>
                <AlertDescription>
                  You're currently on the free tier with limited features. Upgrade to unlock premium features.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Create up to 5 forms</p>
                    <p className="text-sm text-muted-foreground">Design as many forms as you need</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Basic analytics</p>
                    <p className="text-sm text-muted-foreground">See form submission statistics</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 pt-2 pb-4 border-t">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/pricing">
                View Pricing Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex gap-3 items-start">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Email</p>
                <p>{user?.email}</p>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex gap-3 items-start">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Created</p>
                <p>
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AccountPageWrapper>
  )
}

export default ProtectedPage(AccountPage)

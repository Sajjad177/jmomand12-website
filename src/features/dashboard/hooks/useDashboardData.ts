"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAvailablePickupSlots,
  getMyDashboardAuctionActivity,
  getMyInvoices,
  getMyPickupAppointments,
  getMyProfile,
  getMyReadyInvoices,
  getMyWishlist,
  moveWishlistItemToCart,
  removeWishlistItem,
  schedulePickup,
  updateMyProfile,
} from "../api/dashboard.api";

export const dashboardKeys = {
  profile: ["dashboard", "profile"] as const,
  auctionActivity: ["dashboard", "auction-activity"] as const,
  invoices: ["dashboard", "invoices"] as const,
  appointments: ["dashboard", "appointments"] as const,
  readyInvoices: ["dashboard", "ready-invoices"] as const,
  pickupSlots: ["dashboard", "pickup-slots"] as const,
  wishlist: ["dashboard", "wishlist"] as const,
};

export function useDashboardProfile() {
  return useQuery({
    queryKey: dashboardKeys.profile,
    queryFn: getMyProfile,
  });
}

export function useDashboardInvoices() {
  return useQuery({
    queryKey: dashboardKeys.invoices,
    queryFn: getMyInvoices,
  });
}

export function useDashboardAuctionActivity() {
  return useQuery({
    queryKey: dashboardKeys.auctionActivity,
    queryFn: getMyDashboardAuctionActivity,
  });
}

export function useDashboardAppointments() {
  return useQuery({
    queryKey: dashboardKeys.appointments,
    queryFn: getMyPickupAppointments,
  });
}

export function useDashboardReadyInvoices() {
  return useQuery({
    queryKey: dashboardKeys.readyInvoices,
    queryFn: getMyReadyInvoices,
  });
}

export function usePickupSlots(enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.pickupSlots,
    queryFn: getAvailablePickupSlots,
    enabled,
  });
}

export function useDashboardWishlist(enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.wishlist,
    queryFn: getMyWishlist,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateDashboardProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.profile });
    },
  });
}

export function useSchedulePickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schedulePickup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.invoices });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.appointments });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.readyInvoices });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.pickupSlots });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.auctionActivity });
    },
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.wishlist });
    },
  });
}

export function useMoveWishlistItemToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveWishlistItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.wishlist });
      queryClient.invalidateQueries({ queryKey: ["userCartData"] });
    },
  });
}

import { mockUser } from "../mocks/mockUser"

export function useUser() {
    return { user: mockUser, isLoading: false, isLoggedIn: true}
}
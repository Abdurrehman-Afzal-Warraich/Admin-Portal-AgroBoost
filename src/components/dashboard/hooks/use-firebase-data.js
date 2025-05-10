"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where, deleteDoc, doc , getDoc} from "firebase/firestore"
import { db } from "../../../firebaseConfig"

// Hook to fetch user counts by role
export const useUserCounts = () => {
  const [userCounts, setUserCounts] = useState({
    farmers: 0,
    buyers: 0,
    experts: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        // Fetch farmers
        const farmersRef = collection(db, "farmer")
        const farmersSnapshot = await getDocs(farmersRef)
        const farmersCount = farmersSnapshot.docs.length

        // Fetch buyers
        const buyersRef = collection(db, "buyer")
        const buyersSnapshot = await getDocs(buyersRef)
        const buyersCount = buyersSnapshot.docs.length

        // Fetch experts
        const expertsRef = collection(db, "expert")
        const expertsSnapshot = await getDocs(expertsRef)
        const expertsCount = expertsSnapshot.docs.length

        setUserCounts({
          farmers: farmersCount,
          buyers: buyersCount,
          experts: expertsCount,
          total: farmersCount + buyersCount + expertsCount,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user counts:", error)
        setLoading(false)
      }
    }

    fetchUserCounts()
  }, [])

  return { userCounts, loading }
}

// Hook to fetch consultations
export const useConsultations = (timeFilter = "all") => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const consultationsRef = collection(db, "consultations")
        let consultationsQuery = consultationsRef

        // Apply time filter if needed
        if (timeFilter !== "all") {
          const now = new Date()
          const filterDate = new Date()

          switch (timeFilter) {
            case "day":
              filterDate.setDate(now.getDate() - 1)
              break
            case "week":
              filterDate.setDate(now.getDate() - 7)
              break
            case "month":
              filterDate.setMonth(now.getMonth() - 1)
              break
            
            default:
              console.error("Invalid time filter:", timeFilter)
              return
          }

          consultationsQuery = query(consultationsRef, where("createdAt", ">=", filterDate))
        }

        const snapshot = await getDocs(consultationsQuery)
        const consultationsList = snapshot.docs.map((doc) => {
          const data = doc.data()
          // Handle Firestore timestamps
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt,
            lastUpdated: data.lastUpdated,
          }
        })

        setConsultations(consultationsList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching consultations:", error)
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [timeFilter])

  return { consultations, loading }
}

// Hook to fetch auctions
export const useAuctions = (timeFilter = "all") => {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionsRef = collection(db, "auction")
        let auctionsQuery = auctionsRef

        // Apply time filter if needed
        if (timeFilter !== "all") {
          const now = new Date()
          const filterDate = new Date()

          switch (timeFilter) {
            case "day":
              filterDate.setDate(now.getDate() - 1)
              break
            case "week":
              filterDate.setDate(now.getDate() - 7)
              break
            case "month":
              filterDate.setMonth(now.getMonth() - 1)
              break
            default:
              console.error("Invalid time filter:", timeFilter)
              return
          }

          auctionsQuery = query(auctionsRef, where("createdAt", ">=", filterDate))
        }

        const snapshot = await getDocs(auctionsQuery)
        const auctionsList = snapshot.docs.map((doc) => {
          const data = doc.data()
          // Handle Firestore timestamps
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt,
          }
        })

        setAuctions(auctionsList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching auctions:", error)
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [timeFilter])

  return { auctions, loading }
}

// Hook to fetch all users from different collections
export const useAllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch farmers
        const farmersRef = collection(db, "farmer")
        const farmersSnapshot = await getDocs(farmersRef)
        const farmers = farmersSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            role: "farmer",
            // Ensure location is properly handled
            location: data.location || null,
            createdAt: data.createdAt,
          }
        })

        // Fetch buyers
        const buyersRef = collection(db, "buyer")
        const buyersSnapshot = await getDocs(buyersRef)
        const buyers = buyersSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            role: "buyer",
            createdAt: data.createdAt,
          }
        })

        // Fetch experts
        const expertsRef = collection(db, "expert")
        const expertsSnapshot = await getDocs(expertsRef)
        const experts = expertsSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            role: "expert",
            // Ensure consultationHours is properly handled
            consultationHours: data.consultationHours || null,
            createdAt: data.createdAt,
          }
        })

        // Combine all users
        const allUsers = [...farmers, ...buyers, ...experts]
        setUsers(allUsers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching all users:", error)
        setLoading(false)
      }
    }

    fetchAllUsers()
  }, [])

  // Function to delete a user
  const deleteUser = async (userId, role) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      // Delete from the appropriate collection based on role
      const collectionName = role.toLowerCase();
      const userRef = doc(db, collectionName, userId);
      
      // Verify if document exists before deletion
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        console.error("User document does not exist");
        return false;
      }

      await deleteDoc(userRef);
      console.log(`User deleted successfully: ${userId} from ${collectionName}`);

      // Update local state
      setUsers(users.filter((user) => !(user.id === userId && user.role === role)));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert(`Error deleting user: ${error.message}`);
      return false;
    }
  }
  return false;
};
    return { users, loading, deleteUser }
}

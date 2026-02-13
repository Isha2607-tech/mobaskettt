import RestaurantsList from "../restaurant/RestaurantsList"

// GroceryStoresList is just RestaurantsList with grocery context
// The component will show stores instead of restaurants
export default function GroceryStoresList() {
  return <RestaurantsList />
}

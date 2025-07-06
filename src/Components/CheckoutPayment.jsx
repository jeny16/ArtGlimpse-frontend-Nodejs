import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/orderSlice';
import cartService from '../store/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.cart.items);
  const totalAmount = useSelector(state => {
    const items = state.cart.cart.items;
    return items.reduce((acc, item) => acc + item.quantity * item.productData.price, 0);
  });

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        userId: user._id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        totalAmount,
        shippingAddress: { street: "Test St", city: "Demo", zip: "123456" },
        paymentInfo: { razorpayPaymentId: "fake_payment_id" } // replace with actual
      };

      // ✅ Only unwrap thunk
      const response = await dispatch(createOrder(orderPayload)).unwrap();

      // ✅ Do NOT unwrap service call
      for (const item of cartItems) {
        await cartService.deleteItemFromCart(user._id, item.productId);
      }

      dispatch(clearCartServer());
      console.log("Order placed successfully", response);
      alert("Order successful!");
    } catch (error) {
      console.error("Order creation or cart clear failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;

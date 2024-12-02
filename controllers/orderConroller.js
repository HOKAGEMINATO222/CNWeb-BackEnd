const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  console.log(req.body);

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let totalAmount = 0;

    // Kiểm tra và tính toán giá trị của các sản phẩm trong đơn hàng
    
    for (const item of items) {
      // Tìm sản phẩm trong database
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }

      // Tìm biến thể sản phẩm dựa trên màu sắc
      let variantFound = false;
      for (const variant of product.variants) {
        if (variant.color === item.variant.color) {
          variantFound = true;

          // Kiểm tra số lượng sản phẩm còn lại trong kho
          if (variant.quantity < item.quantity) {
            return res.status(400).json({ message: `Not enough stock for ${item.variant.color} variant of ${product.name}` });
          }
          // Tính giá bán sau giảm giá của biến thể
          const priceAfterDiscount = product.price - (product.price * (variant.sale / 100));

          // Tính tổng giá trị đơn hàng (dựa trên giá và số lượng của biến thể)
          totalAmount += item.quantity * priceAfterDiscount; 
          break; 
        }
      }
      // Nếu không tìm thấy biến thể phù hợp
      if (!variantFound) {
        return res.status(400).json({ message: `Variant with color ${item.variant.color} not found for product ${product.name}` });
      }
    }

    // Kiểm tra tổng tiền hợp lệ
    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Total amount is invalid" });
    }

    // Tạo đơn hàng
    const newOrder = new OrderModel({
      userId,
      items,
      totalAmount,
      paymentMethod,
      orderStatus: 'Processing', // Đơn hàng đang được xử lý
      paymentStatus: 'Pending'   // Trạng thái thanh toán là đang chờ xử lý
    });

    await newOrder.save();

    // Giảm số lượng sản phẩm trong kho
    for (const item of items) {
      // Tìm sản phẩm trong database
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
    
      // Tìm biến thể sản phẩm dựa trên màu sắc
      const variant = product.variants.find(variant => variant.color === item.variant.color);
      if (variant) {
        // Kiểm tra số lượng biến thể còn lại trong kho
        if (variant.quantity < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${item.variant.color} variant of ${product.name}` });
        }
    
        // Giảm số lượng của biến thể
        variant.quantity -= item.quantity;

        // Lưu thay đổi vào cơ sở dữ liệu
        await product.save();
      } else {
        return res.status(400).json({ message: `Variant with color ${item.variant.color} not found for product ${product.name}` });
      }
    } 
    
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Lấy danh sách đơn hàng của người dùng
const getOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.find({ userId }).populate('items.productId', 'name price').populate('userId', 'name email');
    
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
};
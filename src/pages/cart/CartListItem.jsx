import useCustomAxios from '@hooks/useCustomAxios.mjs';
// import CheckBox from '@pages/cart/CheckBox';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

CartListItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedCartItem: PropTypes.array.isRequired,
  setSelectedCartItem: PropTypes.func.isRequired,
  setMainCheck: PropTypes.func.isRequired,
  mainCheck: PropTypes.bool.isRequired,
  setItems: PropTypes.func.isRequired,
};

function CartListItem({ item, selectedCartItem, setSelectedCartItem, setMainCheck, mainCheck, setItems }) {
  const axios = useCustomAxios();
  const [productQuantity, setProductQuantity] = useState(item.quantity);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('productQuantity', productQuantity, 'id', item._id);

    let postQuantity = productQuantity - item.quantity;

    if (postQuantity != 0) {
      let cart = { product_id: Number(item.product_id), quantity: postQuantity };

      handleRequest(cart);
    }
  }, [productQuantity]);

  const handleAddQuantity = () => {
    if (!isProcessing) {
      setProductQuantity((prev) => prev + 1);
    }
  };

  const handleReduceQuantity = () => {
    // isProcessing일 경우 handleRequest 함수의 사이클을 온전히 실행한 후 수량 조정을 위해
    if (!isProcessing && productQuantity > 0) {
      //카트에서 제품의 갯수가 1개일 때, 마이너스 버튼을 누르면 delete 요청
      if (productQuantity == 1) {
        handleDeleteItem(item._id);
      } else {
        setProductQuantity((prev) => prev - 1);
      }
    }
  };

  async function handleRequest(cart) {
    setIsProcessing(true);
    await axios.post('/carts', cart);
    const response = await axios.get('/carts');
    if (response.data.item) {
      setItems(response.data.item);
      setIsProcessing(false);
    }
  }

  async function handleDeleteItem(id) {
    console.log(id, '삭제');
    await axios.delete(`/carts/${id}`);
    const response = await axios.get('/carts');
    if (response.data.item) {
      setItems(response.data.item);
    }
  }

  const cartItemCheck = () => {
    console.log('selectedCartItem', selectedCartItem, 'kkk', item);
    if (selectedCartItem.indexOf(item._id) > -1) {
      return true;
    } else {
      return false;
    }
  };

  const handleCartCheck = () => {
    let arrCopy = [...selectedCartItem];
    const index = arrCopy.indexOf(item._id);
    console.log('handleCarrtCHeck', index);
    if (index > -1) {
      let newArr = arrCopy.filter((el) => el != item._id);
      setSelectedCartItem(newArr);
    } else {
      setSelectedCartItem([...selectedCartItem, item._id]);
    }

    if (mainCheck) {
      setMainCheck(false);
    }
    // setAllSelect(false)
  };

  const handleChange = (e) => {
    console.log('E value', e);
  };

  return (
    <div className="cart-item">
      <div className="cart-layout cart-check" onClick={() => handleCartCheck()}>
        <div className="form-input-radio">
          <input type="checkbox" checked={cartItemCheck()} onChange={(e) => handleChange(e)} />
        </div>
      </div>
      <div className="cart-layout">
        <div className="cart-item-info">
          <div className="cart-item-cover">
            <img src={`${import.meta.env.VITE_API_SERVER}/files/${import.meta.env.VITE_CLIENT_ID}/${item.product?.image.fileName}`} alt="커피이미지" />
          </div>
          <p className="cart-item-title">
            PID{item._id} | {item.product?.name}
          </p>
        </div>
      </div>
      <div className="cart-layout cart-quantity">
        <div className="quantity-button" onClick={handleReduceQuantity}>
          -
        </div>
        <div>
          <p>{productQuantity}</p>
        </div>
        <div className="quantity-button" onClick={handleAddQuantity}>
          +
        </div>
      </div>

      <p className="cart-layout cart-price">{(item.product.price * productQuantity).toLocaleString('ko-KR')}</p>

      <p className="button type-btn-cart button-small type-modal-btn" onClick={() => handleDeleteItem(item._id)}>
        삭제
      </p>
    </div>
  );
}

export default CartListItem;
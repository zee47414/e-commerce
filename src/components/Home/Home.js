import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';

export default function Home(props) {
  console.log(props.userId);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [qty, setQty] = useState(1);

  // searchbar handler 
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleAddCart = async (name, category, description, price, img) => {

    const docRef = collection(db, `Products/${props.userId}/myCart`);
    await addDoc(docRef, {
      qty: 1,
      name: name,
      category: category,
      description: description,
      price: price,
      img: img
    });

  }

  //  handling category to filter by category 
  function handleCategory(e) {
    let value = e.target.value;
    if (e.target.checked) {
      setSelectedCategories((prevCategories) => (
        [...prevCategories, value]
      ))
    } else {
      setSelectedCategories((prevCategories) => (
        prevCategories.filter((category) => category !== value)
      ))
    }
    setSearchQuery("");
  }

  // fetching products from firebase while mounting
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Products"), (snapshot) => {
      const products = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      setProducts(products);

    })
    return unsub;
  }, []);

  // filtering products 
  useEffect(() => {

    let filtered = products;
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => (
        selectedCategories.includes(product.category)
      ))
    }
    if (searchQuery) {
      filtered = filtered.filter((product) => (
        product.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      ))
    }
    if (sliderValue > 0) {
      filtered = filtered.filter((product) => (
        product.price <= sliderValue
      ))
    }


    setFilteredProducts(filtered);
  }, [selectedCategories, products, searchQuery, sliderValue]);


  return (
    <>

      <div className={styles.search}>
        <input type='text' placeholder='Search....' onChange={handleSearch} />
      </div>
      <div className={styles.outerContainer}>
        <div className={styles.leftSide}>
          <div >
            <h3>Filter</h3>
            <br />
            <label for="slider">Price:{sliderValue}</label>
            <br />
            <input type="range" id='slider' value={sliderValue} min={0} max={100000} onChange={(e) => (setSliderValue(e.target.value))} />
            <br />
            <br />
            <h3>Category</h3>
            <br />
            <input type="checkbox" id='mensclothing' value="men's clothing" className={styles.input} onChange={handleCategory} />
            <label for="mensclothing">Men's Clothing</label>
            <br />
            <input type="checkbox" id='womensclothing' className={styles.input} value="women's clothing" onChange={handleCategory} />
            <label for="womensclothing" >Women's Clothing</label>
            <br />
            <input type="checkbox" id='electronics' className={styles.input} value="electronics" onChange={handleCategory} />
            <label for="electronics" >Electronics</label>
            <br />
            <input type="checkbox" id='jewelery' className={styles.input} value="jewelery" onChange={handleCategory} />
            <label for="jewelery" >Jewelery</label>
          </div>
        </div>
        <div className={styles.rightSide}>
          {filteredProducts.map((product) => (
            <div className={styles.productContainer} key={product.id}>

              <img src={product.img} alt='product image' />
              <div className={styles.productDetails}>
                <p>{product.description}</p>
                <b>&#8377;{product.price}</b>
              </div>
              <div className={styles.button}>
                <button onClick={() => handleAddCart(product.name, product.category, product.description, product.price, product.img)} > Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
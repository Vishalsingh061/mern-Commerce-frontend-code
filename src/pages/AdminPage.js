import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import not_found_pic from "../img/not_found.png";

// other components
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import SearchComponent from "../filterComponents/SearchComponent";
import SortComponent from "../filterComponents/SortComponent";
import CategoryComponent from "../filterComponents/CategoryComponent";

const pageSize = 12;

const AdminPage = () => {
    const [productList, setProductList] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [category, setCategory] = useState("all");
    const [sortValue, setSortValue] = useState("Select value");
    const [allbrandList, setAllBrandList] = useState([]);
    const [originalBrandList, setOriginalBrandList] = useState([]);

    // Pagination
    const [pagination, setPagination] = useState({
        count: 0,
        from: 0,
        to: pageSize,
    });

    const handlePagination = (event, page) => {
        const from = (page - 1) * pageSize;
        const to = (page - 1) * pageSize + pageSize;
        setPagination({ ...pagination, from, to });
    };

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        setPagination({ ...pagination, count: productList.length });
    }, [productList]);

    const getProduct = async () => {
        try {
            const response = await axios.get("https://merncommerce-f5on.onrender.com/product");
            setProductList(response.data);
            setOriginalData(response.data);

            let brandArray = response.data.map(item => item.brand);
            let uniqBrandList = uniqueArray1(brandArray);
            let uniqCheckList = uniqBrandList.map(item => ({ value: item, checked: false }));

            setOriginalBrandList(uniqCheckList);
            setAllBrandList(uniqCheckList);
        } catch (e) {
            console.log(e);
        }
    };

    const uniqueArray1 = (arr) => {
        const uniqueObj = {};
        arr.forEach(v => { uniqueObj[v + "::" + typeof v] = v; });
        return Object.keys(uniqueObj).map(v => uniqueObj[v]);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value === "") {
            setProductList(originalData);
        } else {
            setProductList(
                originalData.filter(item =>
                    item.title.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleSort = (value) => {
        setSortValue(value);
        let sortedList = [...productList];

        if (value === "ascendingprice") {
            sortedList.sort((a, b) => a.price - b.price);
        } else if (value === "descendingprice") {
            sortedList.sort((a, b) => b.price - a.price);
        } else if (value === "ascendingrating") {
            sortedList.sort((a, b) => a.rating - b.rating);
        } else if (value === "descendingrating") {
            sortedList.sort((a, b) => b.rating - a.rating);
        } else if (value === "ascpricediscount") {
            sortedList.sort((a, b) => a.discountPercentage - b.discountPercentage);
        } else if (value === "descpricediscount") {
            sortedList.sort((a, b) => b.discountPercentage - a.discountPercentage);
        } else {
            sortedList = originalData;
        }
        setProductList(sortedList);
    };

    const handleCatChange = (value) => {
        setCategory(value);
        if (value === "all") {
            setProductList(originalData);
            resetBrandList(originalData);
        } else {
            const filteredList = originalData.filter(item => item.category === value);
            setProductList(filteredList);
            resetBrandList(filteredList);
        }
    };

    const resetBrandList = (list) => {
        let brandArray = list.map(item => item.brand);
        let uniqBrandList = uniqueArray1(brandArray);
        let uniqCheckList = uniqBrandList.map(item => ({ value: item, checked: false }));
        setAllBrandList(uniqCheckList);
    };

    const handleClearFilters = () => {
        setSearchValue("");
        setCategory("all");
        setSortValue("Select value");
        setProductList(originalData);
        setAllBrandList(originalBrandList.map(item => ({ ...item, checked: false })));
    };

    return (
        <React.Fragment>
            <NavBar />
            <Grid container>
                <Grid item xs={2}>
                    <div className="filters">
                        <Grid container direction="column">
                            <Grid item>
                                <Button variant="contained" onClick={handleClearFilters}>
                                    Clear filters
                                </Button>
                            </Grid>
                            <Grid item>
                                <SearchComponent
                                    onChange={handleSearch}
                                    searchValue={searchValue}
                                />
                            </Grid>
                            <Grid item>
                                <SortComponent onChange={handleSort} sortValue={sortValue} />
                            </Grid>
                            <Grid item>
                                <CategoryComponent
                                    onChange={handleCatChange}
                                    categoryValue={category}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <div className="products">
                        <Grid container gap={2}>
                            {productList.length !== 0 ? (
                                productList
                                    .slice(pagination.from, pagination.to)
                                    .map((product) => (
                                        <Grid item key={product._id}>
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                getProduct={getProduct}
                                            />
                                        </Grid>
                                    ))
                            ) : (
                                <Grid container direction="column" alignContent="center">
                                    <img src={not_found_pic} alt="Not found" />
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <Grid container alignContent="center" justifyContent="center" direction="column">
                <Grid item xs>
                    <Pagination
                        count={Math.ceil(pagination.count / pageSize)}
                        color="primary"
                        onChange={handlePagination}
                    />
                </Grid>
            </Grid>
            <br />
        </React.Fragment>
    );
};

export default AdminPage;

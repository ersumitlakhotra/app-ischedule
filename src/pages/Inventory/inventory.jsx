/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Eye, Pencil, Warehouse ,Package,Boxes,AlertTriangle,CircleOff } from "lucide-react";
import { SearchInput,  Select,  CustomTable,Image, ProgressBar, Tooltip, Tags, ActionMenu,Stats } from "../../controls/index.jsx";
import { NoResults, EmptyState, Header, IsLoading } from "../../common/index.jsx";
import { encryptId, getByKey } from "../../common/general.jsx";
import {  UTC_LocalDateTime } from "../../common/localDate.js";

const Inventory = () => {
    const headingLabel = 'Inventory';
    const permissionText = "Inventory";
    const navigate = useNavigate();
    const { refresh, getInventory, getCategory } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortStatus, setSortStatus] = useState('All');
    
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [categoryTypes, setCategoryTypes] = useState([
        { id: 0, label: "All Category", value: "All Category",search:"All Category", count: 0 },
        { id: 999, label: "None", value: "None",search:"None", count: 0 },
    ]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getInventory();
        const CategoryResponse = await getCategory();
        const categories = CategoryResponse.filter((o) => o.category === 'inventory')
            .map((o, index) => ({
                id: o.id,
                label: o.name,
                value: o.id,
                count: 0
            }));
        setCategoryList(categories);
        setList(Response);
        setFilteredList(Response);
        updateCategoryCount(categories, Response)
        setIsLoading(false);
    }


    const updateCategoryCount = (categories, invList) => {
        const counts = invList.reduce((acc, item) => {
            const id = item.categoryid;

            if (id) {
                acc[id] = (acc[id] || 0) + 1;
            }

            return acc;
        }, {});

        setCategoryTypes([
            {
                id: 0,
                label: `All Category (${invList.length})`,
                value: "All Category",
                search: "All Category",
                count: invList.length
            },
            ...categories
                .map(item => ({
                    ...item,
                    label:`${item.label} (${counts[item.id] || 0})`,
                    search:item.label,
                    count: counts[item.id] || 0
                }))
                .filter(item => item.count > 0)
            ,
            {
                id: 999,
                label: `None (${invList.filter(item => !item.categoryid).length})`,
                value: "None",  
                search: "None",
                count: invList.filter( item => !item.categoryid).length
            },
        ]);
    };

    useEffect(() => {
        const category = getByKey(categoryTypes, "id", selectedCategory);
        const categoryId = category?.id;

        const searchedList = List.filter(item =>
        ((item.name || "").toLowerCase().includes(searchInput.toLowerCase()) &&
            (
                selectedCategory === "All Category" ||
                (
                    selectedCategory === "None"
                        ? !item.categoryid
                        : item.categoryid === categoryId
                )
            ) &&
            (
                sortStatus === "All" ||
                (sortStatus === "InStock" && Number(item.stock) > 0) ||
                (sortStatus === "OutStock" && Number(item.stock) === 0)||
                (sortStatus === "LowStock" && Number(item.stock) > 0 && (Number(item.stock) <= Number(item.minstock) +5))
            )
        ));


        setFilteredList(searchedList);
    }, [List, searchInput, sortStatus, selectedCategory])

    const headers = [
        {
            label: "Product", render: (row) => (
                <div className="flex flex-row gap-2 items-center ">
                    <Image src={row.profilepic} name={row.name} height="h-8" width="w-8" className="text-xs " />
                    <span className="font-semibold">{row.name}</span>
                </div>
            ),
        },
        {
            label: "Category", render: (row) => {
                const category = getByKey(categoryList, "id", row.categoryid);
                return ( category?.label || '')
            },
        },      
        {
            label: "Stock",
            render: (row) => (
                <Tooltip placement="top" 
                    title={
                        <div className="flex flex-col items-center gap-1">
                            <span>In Stock : {row.stock}</span>
                            <span>Minimum : {row.minstock}</span>
                        </div>
                    } 
                children={
                    <div className="flex flex-row gap-2 items-center w-36 ">
                        <ProgressBar
                            progress={Number(row.maxstock) > 0 ? (Number(row.stock) / Number(row.maxstock)) * 100 : 0}
                            showLabels={true}
                            startLabel={row.minstock}
                            endLabel={row.maxstock}
                            currentValue={row.stock}
                            minValue={row.minstock}
                            enableStockStatus={true}
                        />
                    </div>}
                />),
        },
        {label: "On Hand",  render: (row) => `${row.stock}`,},
        {
            label: "Sell Price",
            render: (row) => (
                <div className="font-medium">
                    {`$${row.sellprice}`}
                </div>
            ),
        },
        {
            label: "Status",
             render: (row) =>  <Tags title={Number(row.stock) > 0 ? "InStock":"OutStock"}  dot />,      
        },       
        {
            label: "Modified",
            render: (row) =>  `${UTC_LocalDateTime(row.modifiedat, 'DD MMM YYYY h:mm A')}`,     
        },    
        {
            label: "Action",
            render: (row) =>
                
                    <ActionMenu placement="left" width="w-40" actions={[
                        {
                            label: "Edit",
                            permission: "Inventory.Edit",
                            icon: Pencil,
                            shortcut: "⌘E",
                            onClick: () => navigate('/Inventory/Edit/' + encryptId(row.id)),
                        },
                        {
                            label: "View",
                            permission: "Inventory.View",
                            icon: Eye,
                            shortcut: "⌘V",
                            onClick: () => navigate('/Inventory/View/' + encryptId(row.id)),
                        },
                        {
                            label: "Add Item",
                            permission: "Item.Create",
                            icon: Warehouse,
                            shortcut: "⌘I",
                            onClick: () => navigate('/Item/Create/' + encryptId(row.id)),
                        }
                    ]} />,
        }, 
        
    ];

    const statsTypes = [
        {
            id: "Total Products",
            title: "Total Products",
            value: List.length,
            description: "Across all categories",
            icon: Package,
            color: "sky",
            active:sortStatus === "All",
            onClick:() => setSortStatus("All")
        },
        {
            id: "In Stock",
            title: "In Stock",
            value: List.filter(item =>Number(item.stock) > 0).length,
            description: "Available for sale",
            icon: Boxes,
            color: "green",
            active:sortStatus === "InStock",
            onClick:() => setSortStatus("InStock")
        }, 
        {
            id: "Low Stock",
            title: "Low Stock",
            value: List.filter(item => Number(item.stock) > 0 && (Number(item.stock) <= Number(item.minstock) +5)).length,
            description: "Require replenishment",
            icon: AlertTriangle,
            color: "amber",
            active:sortStatus === "LowStock",
            onClick:() => setSortStatus("LowStock")
        },   
        {
            id: "Out of Stock",
            title: "Out of Stock",
            value: List.filter(item =>Number(item.stock) === 0).length,
            description: "Unavailable",
            icon: CircleOff,
            color: "red",
            active:sortStatus === "OutStock",
            onClick:() => setSortStatus("OutStock")
        },      
    ];
    
    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <Header Title={headingLabel} Permission={permissionText} AddButton={"Product"} ExportList={filteredList} onClick={() => navigate('/Inventory/Create')} />

            <div class='flex flex-col md:flex-row  gap-2 items-center justify-between '>
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search . . . ' />
                <div className="w-full md:w-1/4">
                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e)} options={categoryTypes} />
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statsTypes.map((item) => (
                    <Stats
                        key={item.id}
                        title={item.title}
                        value={item.value}
                        description={item.description}
                        icon={item.icon}
                        color={item.color}
                        active={item.active}
                        onClick={item.onClick}
                    />
                ))}
                
            </div>
           
            <IsLoading isLoading={isLoading} rows={10} input={
                List.length === 0 ?
                    <EmptyState
                        title="No Product"
                        buttonText={headingLabel}
                        permission={permissionText}
                        onClick={() => navigate('/Inventory/Create')}
                        description="Build your inventory by adding products. Keep track of stock quantities, inventory movements, and product availability from one place." /> :
                    filteredList.length > 0 ?
                        <CustomTable headers={headers} data={filteredList} rowsPerPage={10} /> :
                        <NoResults
                            buttonText={headingLabel}
                            permission={permissionText}
                            onClick={() => navigate('/Inventory/Create')} />
            } />
        </div>
    )
}

export default Inventory;


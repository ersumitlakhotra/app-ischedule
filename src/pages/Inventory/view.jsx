
import React, { useEffect,  useState } from "react";
import { Tags, Textbox, Textarea, Image, CustomTable, ActionMenu, Button, TabsButton } from "../../controls/index.jsx";
import { EmptyState, IsLoading, NoResults } from "../../common/index.jsx";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FetchData from '../../hook/fetchData.js'
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, encryptId, getByKey } from "../../common/general.jsx";
import { ViewHeader } from "../../common/pageHeader.jsx";
import { get_Date, UTC_LocalDateTime } from "../../common/localDate.js";
import { Pencil, Plus } from "lucide-react";
import { ButtonPermission } from "../../auth/protectedButton.js";

export const Inventory_View = () => {
    const navigate = useNavigate();
    const {  refresh, getCategory ,getInventoryDetail} = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
    const [categoryList, setCategotyList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;

    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        description: "",
        categoryid: null,
        stock: 0,
        minstock: 0,
        maxstock: 0,
        profilepic: "",
        sku: "",
        barcode: "",
        sellprice: 0,
        createdat: null,
        modifiedat: null,
    });

    const [image, setImage] = useState({
        isNew: false,
        profilepic: null,
        file: null,
        fileType: null,
    })
    
    const [selectedTransaction, setSelectedTransaction] = useState(1);
    const [itemTypes, setItemTypes] = useState([
        { id: 1, value: 'All Transaction', label: 'All Transaction', count: 0 },
        { id: 2, value: 'Purchase', label: 'Purchase', count: 0 },
        { id:3, value: 'Usage', label: 'Usage', count: 0 },
        { id: 4, value: 'Sell', label: 'Sell', count: 0 },
    ]);

    useEffect(() => {
        Init();
    }, [refresh])

    const Init = async () => {
        setIsLoading(true);
        const Response = await getCategory();
        const ResponseInventoryDetail = await getInventoryDetail();
        const categoryTypes = Response.filter((o) => o.category === 'inventory')
            .map((o, index) => ({
                id: o.id ?? index + 1,
                label: o.name,
                value: o.id
            })); 
            
        const inventoryDetail = ResponseInventoryDetail.filter((o) => o.invid === id);
        setList(inventoryDetail);
        setFilteredList(inventoryDetail)
        updateCounts(inventoryDetail)
        setCategotyList(categoryTypes);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'inventory',
                    id: id
                });
                if (Response.status === 200) {
                    setForm(Response.data);
                    setImage({
                        ...image,
                        profilepic: Response.data.profilepic
                    })
                }
                else {
                    showAlert({
                        type: "error",
                        message: "Not Found",
                        duration: 5000,
                    });
                    navigate(-1);
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        getById(id);
    }, [id, isEdit]);

    const updateCounts = (list) => {
        const counts = {
            "Purchase": 0,
            "Usage": 0,
            "Sell": 0,
        };

        list.forEach((item) => {
            if (counts[item.transaction] !== undefined) {
                counts[item.transaction]++;
            }
        });
        const total = list.length;

        setItemTypes([
            { id: 1, label: "All Transaction", value: "All Transaction", count: total },
            { id: 2, label: "Purchase", value: "Purchase", count: counts["Purchase"] },
            { id: 3, label: "Usage", value: "Usage", count: counts["Usage"] },
            { id: 4, label: "Sell", value: "Sell", count: counts["Sell"] },
        ])
    };

    useEffect(() => {
        const searchedList =List.filter(item =>(
                selectedTransaction === "All Transaction" || item.transaction === selectedTransaction));            
        setFilteredList(searchedList);
    }, [selectedTransaction])

    const headers = [
        {
            label: "Transaction",
            render: (row) => (
                <Tags title={row.transaction} dot />
            ),
        },
        {
            label: "Date",
            render: (row) => ( `${get_Date(row.trndate, 'DD MMM YYYY')}`
            ),
        },
        { label: "Unit", render: (row) => `${row.unit}`, },
        { label: "Price per unit", render: (row) => `$${row.costprice}`, },
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
                        permission: "Item.Edit",
                        icon: Pencil,
                        shortcut: "⌘E",
                        onClick: () => navigate('/Item/Edit/' + encryptId(id) + '/' + encryptId(row.id)),
                    }
                ]} />,
        }, 

    ];

    return (
        <div class="flex flex-col gap-4 md:px-7 py-4 mb-12">
            <IsLoading isLoading={isLoading} rows={20} input={
                <>
                    <ViewHeader Title={form.name} EditButton={"Product"} onClick={() => navigate('/Inventory/Edit/' + encryptId(id))} Permission={"Inventory"} AddButton={
                        <ButtonPermission permission={`Item.Create`} children={
                            <Button
                                variant="primary"
                                icon={Plus}
                                label={"Add Item"}
                                onClick={() => navigate('/Item/Create/' + encryptId(id))}
                            />} />
                    } />
                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:px-10">

                        {/* Left Column */}
                        <div className="md:col-span-3  space-y-6">
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden mb-4" >

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Product Information
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            View the basic details and current inventory status of this product.
                                        </p>
                                    </div>

                                    <Tags title={Number(form.stock) > 0 ? "In Stock" : "Out of Stock"} dot />
                                </div>

                                {/* Body */}
                                <div className="space-y-6 p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                        <Textbox
                                            label="Product Name"
                                            value={form.name}
                                            disabled
                                        />

                                        <Textbox
                                            label="Category"
                                            value={
                                                getByKey(categoryList, "id", form.categoryid)?.label || ""
                                            }
                                            disabled
                                        />

                                        <Textbox
                                            label="Available Stock"
                                            value={form.stock}
                                            disabled
                                        />

                                    </div>

                                    <Textarea
                                        label="Description"
                                        value={form.description}
                                        disabled
                                    />

                                </div>

                            </div>
                            <TabsButton tabs={itemTypes} defaultActive={selectedTransaction} onChange={(tab) => setSelectedTransaction(tab.value)} />
                           
                            <IsLoading isLoading={isLoading} rows={10}  input={
                                List.length === 0 ?
                                   <EmptyState
                                    title="No stock"
                                    customText={"Add Item"}
                                    permission={"Item"}
                                    onClick={() => navigate('/Item/Create/' + encryptId(id))}
                                    description="Add items to maintain accurate stock levels, monitor product availability, and ensure efficient inventory management across your organization." /> :
                                    filteredList.length > 0 ?
                                        <CustomTable headers={headers} data={filteredList} rowsPerPage={10} /> :
                                        <NoResults
                                            customText={"Add Item"}
                                            permission={"Item"}
                                            onClick={() => navigate('/Item/Create/' + encryptId(id))}/>
                            } />
                  
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-1 self-start space-y-6">

                            <Image
                                src={image.profilepic}
                                rounded="rounded-2xl"
                                height="h-72"
                                width="w-full"
                                name={form.name}
                                avatar={false} 
                            />

                            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">

                                <div className="border-b border-gray-100 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Inventory Details
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Additional inventory information.
                                    </p>
                                </div>

                                <div className="space-y-5 p-6">

                                    <Textbox
                                        label="Minimum Stock"
                                        value={form.minstock}
                                        disabled
                                    />

                                    <Textbox
                                        label="Maximum Stock"
                                        value={form.maxstock}
                                        disabled
                                    />

                                    <Textbox
                                        label="Selling Price"
                                        value={form.sellprice}
                                        disabled
                                    />

                                    <Textbox
                                        label="SKU"
                                        value={form.sku}
                                        disabled
                                    />

                                    <Textbox
                                        label="Barcode"
                                        value={form.barcode}
                                        disabled
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                   
                </>
            } />
        </div>
    );
};






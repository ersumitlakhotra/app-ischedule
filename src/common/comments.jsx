
{/*
<Tooltip placement="bottom" title={'Edit'} >
    <Button variant="default" icon={SquarePen} iconProps={{ color: "#00BCD4", fill: "white", strokeWidth: 1 }} onClick={() => editUser(item.id)} />
</Tooltip>

FetchData({
                    endPoint: "appointment",
                    query: {
                        orderBy: "trndate",
                        orderDir: "DESC",
                        filters: JSON.stringify({
                            uid: {
                                operator: "=",
                                value: form.uid,
                            },
                            status: {
                                operator: "IN",
                                value: ['Pending','Completed'],
                            },
                            trndate: {
                                operator: "BETWEEN",
                                value: [form.trndate, form.trndate],
                            },
                            ...(isEdit && {
                                id: {
                                    operator: "!=",
                                    value: id,
                                },
                            }),
                        }),
                    },
                }),



 const [attendanceResponse, appointmentResponse] = await Promise.all([
                getAttendance(form.trndate, form.trndate),
                

            ]);


             const [payment, setPayment] = useState({
                    id: null,
                    paymenttype: null, // Cash, Card, Interac, Cheque, etc.
                    amount: "0",
                    createdat: null,
                    modifiedat: null,
                });




                 <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                            ))}

                            <div className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center text-xs">
                                +4
                            </div>
                        </div>



   -------------------------------------- TWAK -------------------------                  
    useEffect(() => {
        waitForTawk(() => {
            if (isAuthenticated) {
                window.Tawk_API.showWidget();
            } else {
                if (isTawkLogin) {
                    window.Tawk_API.logout(
                        function (error) {
                            if (error) {
                                // console.error("Tawk Logout error:", error);
                            } else {
                                setIsTawkLogin(false)
                                window.location.reload(); 
                            }
                        });
                }
                window.Tawk_API.hideWidget();
            }
        });
    }, [isAuthenticated])

    const waitForTawk = (callback) => {
        const interval = setInterval(() => {
            if (Object.keys(window.Tawk_API).length > 0) {
                clearInterval(interval);
                callback();
            }
        }, 100); // check every 100ms
    };

    const loginTawkUser = (id, name ) => {

        const hash = HmacSHA256(id, process.env.REACT_APP_TAWK_TO_SECRET).toString(Hex) // ✅ MUST use email
        window.Tawk_API.login({
            userId: id,
            name: name,
            hash: hash,
        });
        window.Tawk_API.login(
                {
                    userId: id,
                    name: name,
                    //email: user.email,
                    hash: hash,
                },
                function (error) {
                    if (error) {
                        console.error("Tawk login error:", error);
                    } else {
                        console.log("Tawk login success");
                    }
                }
            );
            
               

          
    };  
*/}
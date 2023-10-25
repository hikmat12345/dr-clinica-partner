import { Line, Wrapper } from "./card.style";
import Typography from "../Typography";
import { FlexRow } from "../../styles/index.style";
import { cardData } from "../../Data";
import { Segmented, Space } from 'antd';
import Button from "../Button";
export const Card = (props) => {
    const { title, detail } = props;
    const PackageData = props.packageData;
    // console.log(PackageData, "Package Data from Subscription")
    const Features = PackageData?.map((res) => {
        return (
            res.packagefeatures.map((res) => { return (res) })
        )
    })
    //  console.log(Features, "Package Data in Card")
    return (
        <>
            <Wrapper customPadding="1rem" customBorder="1px solid #D5E0EF">
                <Typography type="h1" weight="semiBold" color="black" center="center">{props.title} </Typography>
                &nbsp;
                <div>
                    <Space direction="horizontal">
                        <Segmented
                            block={true}
                            size="small"
                            options={[
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <div>
                                                <Typography type="small" weight="medium" color="gray">
                                                    Pay monthly
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography type="h1" weight="semiBold" color="#09ADEF">${props.price}.00</Typography>
                                            </div>
                                            <div>
                                                <Typography type="small" weight="medium" color="gray">
                                                    /month
                                                </Typography>
                                            </div>
                                        </div>
                                    ),
                                    value: 'spring',
                                },
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <div>
                                                <Typography type="small" weight="medium" color="gray">
                                                    Pay every 12 month
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography type="h1" weight="semiBold" color="#09ADEF" center="center">$165.83</Typography>
                                            </div>
                                            <div>
                                                <Typography type="small" weight="medium" color="gray">
                                                    /month
                                                </Typography></div>
                                        </div>
                                    ),
                                    value: 'summer',
                                },

                            ]}
                        />
                    </Space>
                </div>
                &nbsp;
                <Button>Upgrade</Button>
                &nbsp;
                <Wrapper bg="#E5FBF3" >
                    <Typography type="small" weight="medium" color="gray">
                        {props.description}
                    </Typography>
                </Wrapper>
                &nbsp;
                <Line />
                &nbsp;
                {/* {
                    Features && Features.map((data) => {
                        
                        return (data.map((res)=>{
                            console.log(res, "HO ja ")
                           return(
                            <>
                             <>
                            <FlexRow paddingRight>
                                    <Typography type="small" weight="medium" color="#64748B">
                                        {res.name}
                                    </Typography>
                                    <Typography type="small" weight="medium" color="black">
                                        {res.value}
                                    </Typography>
                                </FlexRow>
                            </>
                            </>
                           )
                        }))
                    })
                } */}
                {
                    Features?.map((data) => {
                        // s
                        return (
                            
                                data.map((data) => {
                                    return (
                                        <>
                                            <FlexRow paddingRight>
                                                <Typography type="small" weight="medium" color="#64748B">
                                                    {data.name}
                                                </Typography>
                                                <Typography type="small" weight="medium" color="black">
                                                    {data.value}
                                                </Typography>
                                            </FlexRow>
                                        </>
                                    )
                                })
                            
                        )
                    })
                }

            </Wrapper>
        </>
    );
}
export default Card;
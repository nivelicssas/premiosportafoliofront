import { GetServerSideProps, NextPage } from 'next'
import getLandingPage from '@actions/getLandingPage'
import RegistryPageDTO from '@utils/DTO/RegistryPageDTO'
import MainBannerDTO from '@utils/DTO/MainBannerDTO'
import MorePortafolioSectionDTO from '@utils/DTO/MorePortafolioSectionDTO'
import MainBanner from '@molecules/MainBanner/MainBanner'
import { MorePortafolioSectionModel } from '@models/morePortafolioSection.model'
import { MainBanneSectionModel } from '@models/mainBanner.model'
import MorePortafolioSection from '@organisms/MorePortafolioSection/MorePortafolioSection'
import RegisterForm from '@molecules/RegisterForm/RegisterForm'

const UserPage: NextPage<{
  mainBannerData: MainBanneSectionModel | null
  morePortafolioData: MorePortafolioSectionModel | null
}> = (props) => {
  return (
    <>
      {props.mainBannerData && <MainBanner data={props.mainBannerData} />}
      <RegisterForm />
      {props.morePortafolioData && (
        <MorePortafolioSection data={props.morePortafolioData} />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [landingPageData] = await getLandingPage()
  const pageData = RegistryPageDTO(landingPageData)
  const mainBannerData = MainBannerDTO(pageData?.mainBanner)
  const morePortafolioData = MorePortafolioSectionDTO(
    pageData?.seeMorePortafolio
  )
  return {
    props: {
      mainBannerData,
      morePortafolioData,
    },
  }
}

export default UserPage

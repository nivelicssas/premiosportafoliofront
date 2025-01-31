import { ContactUsSectionModel } from '@models/contactUs.model'
import styles from '@styles/scss/organisms/contactUs.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { myLoader } from '@utils/customLoaderImages'

type Props = {
  data: ContactUsSectionModel
  activeRegister: boolean
}

const ContactUsSection = ({ data, activeRegister }: Props) => {
  return (
    <section
      className={styles.contactUs}
      style={{ backgroundImage: `url(${data.backgroundMobile.source})` }}
    >
      <h2 className={styles.contactUs__title}>{data.title}</h2>
      <div
        className={styles.contactUs__description}
        dangerouslySetInnerHTML={{ __html: data.description }}
      ></div>
      {activeRegister && (
        <Link href={'/registro'} passHref>
          <a className={styles.contactUs__button}>Regístrate aquí</a>
        </Link>
      )}
      <div className={styles.contactUs__auxiliaryImage}>
        <Image
          loader={myLoader}
          src={data.auxiliaryImage.source}
          alt={data.auxiliaryImage.alt}
          title={data.auxiliaryImage.title}
          width={450}
          height={450}
        />
      </div>
    </section>
  )
}

export default ContactUsSection

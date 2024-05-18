import RegisterForm from '@molecules/RegisterForm/RegisterForm'
import Introduccionblock from '@molecules/Introduccionblock/Introduccionblock'

const UserPage = () => {
  return (
    <>
      <Introduccionblock textTitle='Regístrate en Premios Portafolio 2024'>
        <p>
          {' '}
          Si quiere realizar el proceso de{' '}
          <strong> inscripción como empresa y persona, </strong> deberá hacer el
          registro con <mark> usuarios diferentes </mark> para cada postulación.{' '}
        </p>
      </Introduccionblock>
      <RegisterForm />
    </>
  )
}

export default UserPage

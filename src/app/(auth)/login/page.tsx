import { LoginPage } from '#components/login'
import { createPage } from '#lib/create-page'

const { Page, metadata } = createPage({
    title: 'Login',
    renderComponent: LoginPage,
})

export { metadata }
export default Page
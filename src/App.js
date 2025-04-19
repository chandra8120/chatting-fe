import { AuthProvider } from './AuthContext'
import Routing from './Routing'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </div>
  )
}

export default App

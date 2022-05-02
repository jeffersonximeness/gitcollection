import React from 'react'

import { Title, Form, Repos, Error } from './styles'
import logo from '../../assets/logo.svg'
import { FiChevronRight } from 'react-icons/fi'

import { api } from '../../services/api'

interface IOwner {
    login: string
    avatar_url: string
}

interface GithubRepository {
    full_name: string
    description: string
    owner: IOwner
}

export const Dashboard: React.FC = () => {

    const [repos, setRepos] = React.useState<GithubRepository[]>([])
    const [newRepo, setNewRepo] = React.useState('')
    const [inputError, setInputError] = React.useState('')


    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setNewRepo(event.target.value)
    }

    async function handleAddRepo(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!newRepo) {
            setInputError('Informe o username/repository')
            return
        }

        const response = await api.get<GithubRepository>(`/repos/${newRepo}`)

        const repository = response.data

        setRepos([...repos, repository])
        setNewRepo('')
    }

    return (
        <>
            <img src={logo} alt="GitCollection"/>
            <Title>
                Catálogo de Repositórios do Github
            </Title>

            <Form
                onSubmit={handleAddRepo}
                hasError={Boolean(inputError)}
            >
                <input placeholder='username/repository_name' onChange={handleInputChange} />
                <button type='submit'>Buscar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}

            <Repos>
                {repos.map((repository, index) => (
                    <a href="/repositories" key={index}>
                        <img 
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login} 
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Repos>
        </>
    )
}
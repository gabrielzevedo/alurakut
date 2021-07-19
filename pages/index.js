import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { useEffect, useState } from 'react';

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} />
      <hr />
      <a className="boxLink" href={`https://github.com.br${props.githubUser}`}>
        @{props.githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home() {
  const githubUser = 'gabrielzevedo';
  const [comunidades, setComunidades] = useState([]);
  const pessoasFavoritas = [
    'gabrielzevedo',
    'gabrielzevedo',
    'gabrielzevedo',
    'gabrielzevedo'
  ]

  const [seguidores, setSeguidores] = useState([])
  useEffect(() => {
    // github api
    fetch('https://api.github.com/users/' + githubUser + '/followers')
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        setSeguidores(response);
      })

    // api graphql
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_DATO_CMS_AUTHORIZATION,
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
            _status
            _firstPublishedAt
          }

          _allCommunitiesMeta {
            count
          }
        }`
      }),
    })
    .then((response) => response.json())
    .then((response) => {
      console.log(response.data.allCommunities);
      setComunidades(response.data.allCommunities);
    })
  }, [])

  function ProfileRelationsBox(props) {
    return (
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {props.title} ({props.items.length})
        </h2>

        <ul>
          {/* {comunidades.map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={`/users/${itemAtual.title}`}>
                  <img src={itemAtual.image} />
                  <span>{itemAtual.title}</span>
                </a>
              </li>
            )
          })} */}
        </ul>
      </ProfileRelationsBoxWrapper>
    )
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCommunityCreate(event) {
              event.preventDefault();
              const dadosForm = new FormData(event.target);

              const comunidade = {
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(comunidade),
              }).then(async (response) => {
                const data = await response.json();
                const comunidade = data;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  type="text"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>
              <div>
                <input
                  placeholder="Qual vai ser a imagem da sua comunidade?"
                  name="image"
                  type="text"
                  aria-label="Qual vai ser a imagem da sua comunidade?"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

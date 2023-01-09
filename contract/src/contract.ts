import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  initialize,
} from 'near-sdk-js'
import { AccountId } from 'near-sdk-js/lib/types'

class Token {
  token_id: number
  owner_id: string
  name: string
  description: string
  media_uri: string
  levels: number
  approved_account_ids: Record<string, number>

  constructor(
    token_id: number,
    owner_id: string,
    name: string,
    description: string,
    media_uri: string,
    levels: number,
    approved_account_ids: Record<string, number>
  ) {
    this.token_id = token_id
    this.owner_id = owner_id
    this.name = name
    this.description = description
    this.media_uri = media_uri
    this.levels = levels
    this.approved_account_ids = approved_account_ids
  }
}

interface InitProps {
  owner_id: AccountId
  prefix: string
}

interface TokenProps {
  token_owner_id: string
  name: string
  description: string
  media_uri: string
  levels: number
  approved_account_ids: Record<string, number>
}

interface ApproveProps {
  token_id: string
  account_id: string
}

@NearBindgen({})
class NFT {
  // TODO: Who owns this contract
  owner_id: AccountId
  token_id: number
  owner_by_id: LookupMap<String>
  token_by_id: LookupMap<Token>

  constructor() {
    this.token_id = 0
    this.owner_id = ''
    this.owner_by_id = new LookupMap('Thang')
    this.token_by_id = new LookupMap<Token>('0')
  }

  @initialize({})
  initNft({ owner_id }: InitProps) {
    this.token_id = 0
    this.owner_id = owner_id
    // this.owner_by_id = new LookupMap(prefix)
  }

  // ERC721: Approval Management
  @view({})
  nft_approve({ token_id, account_id }: ApproveProps) {
    near.log('nft_approve just being executed!')
  }

  @call({})
  mint_nft({
    token_owner_id,
    name,
    description,
    media_uri,
    levels,
    approved_account_ids,
  }: TokenProps): Token {
    // TODO: Who onw this token
    // TODO: Token -> Onwer: based on the id of token in Contract
    // TODO: 0 -> thanglemon204.testnet
    this.owner_by_id.set(this.token_id.toString(), token_owner_id)

    const token = new Token(
      this.token_id,
      token_owner_id,
      name,
      description,
      media_uri,
      levels,
      approved_account_ids
    )

    // TODO: Info go alongaside with the token_id
    this.token_by_id.set(this.token_id.toString(), token)

    // TODO: Generate the token_id for the next mint
    this.token_id++

    return token
  }

  @view({})
  get_token_by_id({ token_id }: { token_id: number }): Token {
    near.log('get_token_by_id is just being executed!')
    let token: Token = this.token_by_id.get(token_id.toString())

    if (token == null) {
      return null
    }

    return token
  }

  @view({})
  get_all_tokens(): Token[] {
    near.log('get_all_tokens is just being executed!')
    var all_tokens = []

    for (var i = 0; i < this.token_id; i++) {
      all_tokens.push(this.token_by_id.get(i.toString()))
    }

    return all_tokens
  }
}

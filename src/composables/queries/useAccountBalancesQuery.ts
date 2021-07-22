import { reactive, ref, Ref, computed } from 'vue';
import { useQuery } from 'vue-query';
import { UseQueryOptions } from 'react-query/types';
import QUERY_KEYS from '@/constants/queryKeys';
import { tokenService } from '@/services/token/token.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import { TokenInfoMap } from '@/types/TokenList';
import useWeb3 from '@/services/web3/useWeb3';

// TYPES
type Response = BalanceMap;

export default function useAccountBalancesQuery(
  tokens: Ref<TokenInfoMap> = ref({}),
  options: UseQueryOptions<Response> = {}
) {
  const { account, isWalletReady } = useWeb3();

  const tokenAddresses = computed(() => Object.keys(tokens.value));

  const queryKey = reactive(
    QUERY_KEYS.Account.Balances(account, tokenAddresses)
  );

  const queryFn = async () => {
    console.log('Fetch balances');
    return await tokenService.balances.get(account.value, tokens.value);
  };

  const queryOptions = reactive({
    enabled: isWalletReady,
    ...options
  });

  return useQuery<Response>(queryKey, queryFn, queryOptions);
}

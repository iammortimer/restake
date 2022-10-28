import React from "react";
import _ from "lodash";
import TooltipIcon from "./TooltipIcon";

import { XCircle } from "react-bootstrap-icons";
import { joinString } from "../utils/Helpers.mjs";
import Coins from "./Coins";

function REStakeStatus(props) {
  const { network, validator, operator, delegation, grants, authzSupport, className } = props

  const minimumReward = operator && {
    amount: operator.minimumReward,
    denom: network.denom,
  };

  let content, tooltip
  let styleClass = 'text-decoration-underline'
  if(operator){
    let tooltipContent
    if(authzSupport){
      if(delegation){
        if(grants?.grantsValid){
          let limit
          if(grants.maxTokens){
            limit = <span><br />(<Coins coins={{ amount: grants.maxTokens, denom: network.denom }} asset={network.baseAsset} fullPrecision={true} hideValue={true} /> remaining)</span>
          }else{
            limit = '(no limit)'
          }
          tooltipContent = <span>Grant active {limit}</span>
          styleClass = 'text-success'
        }else if(grants?.grantsExist){
          tooltipContent = 'Update grants to enable REStake'
          styleClass = 'text-danger'
        }else{
          tooltipContent = 'Grant to enable REStake'
        }
      }else{
        tooltipContent = 'Delegate to enable REStake'
      }
    }else{
      tooltipContent = `Enable REStake once ${network.prettyName} supports Authz`
    }
    content = <small className={joinString(`text-nowrap text-decoration-underline`, styleClass, className)}>{operator.frequency()}</small>
    tooltip = (
      <div className="mt-2 text-center">
        <p>REStakes {operator.runTimesString()}</p>
        <p>
          Minimum reward is{" "}
          <Coins
            coins={minimumReward}
            asset={network.baseAsset}
            fullPrecision={true}
            hideValue={true}
          />
        </p>
        <p>{tooltipContent}</p>
      </div>
    )
  }else{
    content = <XCircle className={joinString(`opacity-50`, className)} />
    tooltip = 'This validator is not a REStake operator'
  }

  return (
    <span role={props.onClick ? 'button' : ''} onClick={props.onClick}>
      <TooltipIcon
        icon={content}
        identifier={validator.operator_address}
        rootClose={true}
        tooltip={tooltip}
      />
    </span>
  )
}

export default REStakeStatus
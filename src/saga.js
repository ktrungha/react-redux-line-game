import { all, take, put, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { TARGET, MOVE, CHOOSE, RELOCATE_FUTURE, NEXT, ADD_FUTURE, UNCHOOSE, MARK_REMOVE_BALLS, REMOVE_BALLS } from './reducer'
import { findPath, addNewBall } from './utils'
import { addAmount } from './Constants';

function* target() {
  while (true) {
    const action = yield take(TARGET)
    const path = findPath(action.fromX, action.fromY, action.toX, action.toY, action.content)
    let currentX = action.fromX
    let currentY = action.fromY
    if (path !== undefined) {
      for (let i = 0; i < path.length; i++) {
        const node = path[i].split('-')
        const nextX = parseInt(node[0], 10)
        const nextY = parseInt(node[1], 10)
        yield put({ type: MOVE, fromX: currentX, fromY: currentY, toX: nextX, toY: nextY })
        yield delay(20)

        currentX = nextX
        currentY = nextY
      }
      yield put({ type: UNCHOOSE })
      yield put({ type: RELOCATE_FUTURE, fromX: action.fromX, fromY: action.fromY, x: action.toX, y: action.toY })
      yield put({ type: NEXT })
      yield delay(50)
      
      yield put({ type: MARK_REMOVE_BALLS})
      yield delay(100)
      yield put({ type: REMOVE_BALLS})

      for (let i = 0; i < addAmount; i++) {
        const currentContent = yield select((state) => state.content)

        const obj = addNewBall(currentContent)
        if (obj !== null) {
          yield put({ type: ADD_FUTURE, futures: [obj] })
        }
      }

      break
    }
  }
}

function* move() {
  yield takeLatest(CHOOSE, target)
}

export default function* rootSaga() {
  yield all([move()])
}
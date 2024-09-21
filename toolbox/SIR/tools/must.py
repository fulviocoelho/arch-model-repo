class must:
    _f = None
    def __init__(self, f):
        self._f = f
    def raise_exception(self, **error):
        if error:
            raise Exception(error)
        raise Exception('Condition Not Met')
    def eq(self, l):
        if self._f != l:
            self.raise_exception()
    def diff(self, l):
        if self._f == l:
            self.raise_exception()
    def bigger(self, l):
        if self._f <= l:
            self.raise_exception()
    def minor(self, l):
        if self._f >= l:
            self.raise_exception()
    def bigger_eq(self, l):
        if self._f < l:
            self.raise_exception()
    def minor_eq(self, l):
        if self._f > l:
            self.raise_exception()
    def _in(self, l):
        if self._f not in l:
            self.raise_exception()
    def not_in(self, l):
        if self._f in l:
            self.raise_exception()